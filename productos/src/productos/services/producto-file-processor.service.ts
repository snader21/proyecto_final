import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Storage } from '@google-cloud/storage';
import { parse } from 'csv-parse';
import { ConfigService } from '@nestjs/config';
import { ProductoEntity } from '../entities/producto.entity';
import { ArchivoProductoEntity } from '../entities/archivo-producto.entity';
import { ProductoValidator } from '../validations/producto-validator.interface';
import axios from 'axios';

@Injectable()
export class ProductoFileProcessorService {
  private readonly storage: Storage;
  private readonly projectId: string;
  private readonly keyFilename: string;

  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @InjectRepository(ArchivoProductoEntity)
    private readonly archivoProductoRepository: Repository<ArchivoProductoEntity>,
    private readonly validators: ProductoValidator[],
    private readonly configService: ConfigService,
  ) {
    this.projectId = this.configService.get('GCP_PROJECT_ID') || '';
    this.keyFilename = this.configService.get('GCP_KEY_FILE') || '';
    this.storage = new Storage({
      projectId: this.projectId,
      keyFilename: this.keyFilename,
    });
  }

  async processFile(archivoProductoId: string) {
    const archivoProducto = await this.archivoProductoRepository.findOne({
      where: { id_archivo: archivoProductoId }
    });

    if (!archivoProducto) {
      throw new Error('Archivo no encontrado');
    }

    try {
      const fileContent = await this.downloadFile(archivoProducto.url);
      const rows = await this.parseCSV(fileContent);
      
      let totalRows = rows.length;
      let successfulRows = 0;
      let errors: Array<{row: any, error: string}> = [];

      for (const row of rows) {
        try {
          // Ejecutar todas las validaciones
          const validationResults = await Promise.all(
            this.validators.map(validator => validator.validate(row))
          );

          const validationFailed = validationResults.find(result => !result.isValid);
          if (validationFailed) {
            errors.push({
              row: row,
              error: validationFailed.message || 'Validación fallida'
            });
            continue;
          }

          // Si todas las validaciones pasan, crear el producto
          const productoData: DeepPartial<ProductoEntity> = {
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
            pais: { id_pais: row.paisId }
          };

          const nuevoProducto = this.productoRepository.create(productoData);
          await this.productoRepository.save(nuevoProducto);

          successfulRows++;
        } catch (error: any) {
          errors.push({
            row: row,
            error: error.message
          });
        }
      }

      // Actualizar estado del archivo según resultados
      let estado;
      if (successfulRows === 0) {
        estado = 'fallida';
      } else if (successfulRows === totalRows) {
        estado = 'cargado';
      } else {
        estado = 'carga_parcial';
      }

      await this.archivoProductoRepository.update(archivoProductoId, {
        estado,
        total_registros: totalRows,
        registros_cargados: successfulRows,
        errores_procesamiento: errors
      });

    } catch (error: any) {
      await this.archivoProductoRepository.update(archivoProductoId, {
        estado: 'fallida',
        errores_procesamiento: [{ error: error.message }]
      });
      throw error;
    }
  }

  private async downloadFile(signedUrl: string): Promise<string> {
    try {
      const response = await axios.get(signedUrl);
      return response.data;
    } catch (error) {
      throw new Error(`Error downloading file: ${error.message}`);
    }
  }

  private async parseCSV(content: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      parse(content, {
        columns: true,
        skip_empty_lines: true,
      }, (err: unknown, data: any[]) => {
        if (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        } else {
          resolve(data);
        }
      });
    });
  }
}
