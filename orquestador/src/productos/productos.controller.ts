import {
  Controller,
  Post,
  Body,
  Get,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-inventario.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post('movimientos-inventario')
  async crearMovimientoInventario(@Body() dto: CreateMovimientoInventarioDto) {
    return this.productosService.crearMovimientoInventario(dto);
  }

  @Get('categorias')
  async getCategories() {
    return this.productosService.getCategories();
  }

  @Get('marcas')
  async getBrands() {
    return this.productosService.getBrands();
  }

  @Get('unidades-medida')
  async getUnits() {
    return this.productosService.getUnits();
  }

  @Get('ubicaciones')
  async getUbicaciones() {
    return this.productosService.getUbicaciones();
  }

  @Get()
  async getProducts() {
    return this.productosService.getProducts();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async saveProduct(
    @Body('product') productoStr: string,
    @UploadedFiles() files: any[],
  ): Promise<any> {
    try {
      const producto = JSON.parse(productoStr);
      return await this.productosService.saveProduct(producto, files);
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }

  @Post('upload-csv')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadCSV(@UploadedFiles() files: any[]): Promise<{ url: string }> {
    try {
      return await this.productosService.uploadCSV(files[0]);
    } catch (error) {
      console.error('Error uploading CSV:', error);
      throw error;
    }
  }

  @Get('archivos-csv')
  async getCSVFiles() {
    return this.productosService.getCSVFiles();
  }
}
