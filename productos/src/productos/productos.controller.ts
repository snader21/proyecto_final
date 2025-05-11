import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseInterceptors,
  UploadedFiles,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from './interfaces/uploaded-file.interface';
import { ProductosService } from './productos.service';
import { ProductoPorPedidoDto } from './dto/producto-por-pedido.dto';
import { CategoriaEntity } from './entities/categoria.entity';
import { MarcaEntity } from './entities/marca.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { ProductoEntity } from './entities/producto.entity';
import { ResultadoCargaImagenes } from './interfaces/resultado-carga-imagenes.interface';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get('categorias')
  async obtenerCategorias(): Promise<CategoriaEntity[]> {
    return this.productosService.obtenerCategorias();
  }

  @Get('marcas')
  async obtenerMarcas(): Promise<MarcaEntity[]> {
    return this.productosService.obtenerMarcas();
  }

  @Get('unidades-medida')
  async obtenerUnidadesMedida(): Promise<UnidadMedidaEntity[]> {
    return this.productosService.obtenerUnidadesMedida();
  }

  @Get('archivos-csv')
  async obtenerArchivosCSV() {
    return this.productosService.obtenerArchivosCSV();
  }

  @Get(':idPedido')
  async obtenerProductosPorPedido(
    @Param('idPedido') idPedido: string,
  ): Promise<ProductoPorPedidoDto[]> {
    return this.productosService.obtenerProductosPorPedido(idPedido);
  }

  @Get()
  async obtenerProductos(): Promise<ProductoEntity[]> {
    return this.productosService.obtenerProductos();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async guardarProducto(
    @Body('product') productoStr: string,
    @UploadedFiles() files: UploadedFile[],
  ): Promise<ProductoEntity> {
    const producto = JSON.parse(productoStr);
    return this.productosService.GuardarProducto(producto, files);
  }

  @Post('upload-csv')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadCSV(
    @UploadedFiles() files: UploadedFile[],
  ): Promise<{ url: string }> {
    return this.productosService.guardarArchivoCSV(files[0]);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async actualizarProducto(
    @Param('id') id: string,
    @Body('product') productoStr: string,
    @UploadedFiles() files: UploadedFile[],
  ): Promise<ProductoEntity> {
    const producto = JSON.parse(productoStr);
    return this.productosService.actualizarProducto(id, producto, files);
  }

  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('files', 25))
  async guardarImagenesProductos(
    @UploadedFiles() files: UploadedFile[],
  ): Promise<ResultadoCargaImagenes> {
    return await this.productosService.guardarImagenesProductos(files);
  }
}
