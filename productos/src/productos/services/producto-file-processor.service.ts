import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../entities/producto.entity';
import { ArchivoProductoEntity } from '../entities/archivo-producto.entity';
import { FileGCP } from '../utils/file-gcp.service';
import { ProductoValidator } from '../validations/producto-validator.interface';
import { parse } from 'csv-parse';

@Injectable()
export class ProductoFileProcessorService {
  private readonly logger = new Logger(ProductoFileProcessorService.name);

  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @InjectRepository(ArchivoProductoEntity)
    private readonly archivoProductoRepository: Repository<ArchivoProductoEntity>,
    @Inject('PRODUCTO_VALIDATORS')
    private readonly validators: ProductoValidator[],
    private readonly fileGCP: FileGCP,
  ) {}

  async processFile(archivoProductoId: string) {
    const archivoProducto = await this.archivoProductoRepository.findOne({
      where: { id_archivo: archivoProductoId },
    });

    if (!archivoProducto) {
      this.logger.error(`Archivo no encontrado: ${archivoProductoId}`);
      return;
    }

    if (
      archivoProducto.estado === 'procesado' ||
      archivoProducto.estado === 'error'
    ) {
      return;
    }

    try {
      const urlParts = archivoProducto.url
        .split('?X-Goog-Algorithm')[0]
        .split('/');
      const fileName =
        urlParts[urlParts.length - 2] + '/' + urlParts[urlParts.length - 1];
      console.log(
        '🚀 ~ ProductoFileProcessorService ~ processFile ~ fileName:',
        fileName,
      );
      const decodedFileName = decodeURIComponent(fileName);

      const fileContent = await this.fileGCP.getFile(decodedFileName);

      const rows = await this.parseCSV(fileContent.toString('utf-8'));

      let totalRows = rows.length;
      let successfulRows = 0;
      let errors: Array<{ row: any; error: string }> = [];

      this.logger.log(
        `Procesando archivo ${archivoProducto.nombre_archivo} (${totalRows} registros)`,
      );

      for (const row of rows) {
        try {
          const validationResults = await Promise.all(
            this.validators.map(async (validator) => {
              try {
                return await validator.validate(row);
              } catch (error) {
                return { isValid: false, message: error.message };
              }
            }),
          );

          const validationFailed = validationResults.find(
            (result) => !result.isValid,
          );
          if (validationFailed) {
            errors.push({
              row: row,
              error: validationFailed.message || 'Validación fallida',
            });
            continue;
          }

          const productoData = {
            nombre: row.nombre,
            descripcion: row.descripcion,
            sku: row.sku,
            codigo_barras: row.codigo_barras,
            categoria: { id_categoria: row.categoriaId },
            marca: { id_marca: row.marcaId },
            unidad_medida: { id_unidad_medida: row.unidadMedidaId },
            precio: row.precio || 0,
            activo: true,
            alto: row.alto || 0,
            ancho: row.ancho || 0,
            largo: row.largo || 0,
            peso: row.peso || 0,
            fecha_creacion: new Date(),
            fecha_actualizacion: new Date(),
            id_fabricante: row.id_fabricante || '',
            pais: { id_pais: row.paisId },
          };

          const nuevoProducto = this.productoRepository.create(productoData);
          await this.productoRepository.save(nuevoProducto);
          successfulRows++;
        } catch (error: any) {
          errors.push({
            row: row,
            error: error.message,
          });
        }
      }

      let estado =
        successfulRows === 0
          ? 'error'
          : successfulRows === totalRows
            ? 'procesado'
            : 'parcial';

      await this.archivoProductoRepository.update(archivoProductoId, {
        estado,
        total_registros: totalRows,
        registros_cargados: successfulRows,
        errores_procesamiento: errors,
        fecha_procesamiento: new Date(),
      });

      this.logger.log(
        `Archivo ${archivoProducto.nombre_archivo} procesado: ${successfulRows}/${totalRows} registros exitosos`,
      );
    } catch (error: any) {
      this.logger.error(
        `Error procesando archivo ${archivoProducto.nombre_archivo}:`,
        error,
      );
      await this.archivoProductoRepository.update(archivoProductoId, {
        estado: 'error',
        errores_procesamiento: [{ error: error.message }],
        fecha_procesamiento: new Date(),
      });
      throw error;
    }
  }

  private async parseCSV(content: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      parse(
        content,
        {
          columns: true,
          skip_empty_lines: true,
        },
        (err: unknown, data: any[]) => {
          if (err) reject(err instanceof Error ? err : new Error(String(err)));
          else resolve(data);
        },
      );
    });
  }
}
