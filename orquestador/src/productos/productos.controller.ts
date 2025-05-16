import {
  Controller,
  Post,
  Put,
  Body,
  Get,
  UploadedFiles,
  UseInterceptors,
  Query,
  Param,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateEntradaInventarioDto } from './dto/create-entrada-inventario.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { QueryInventarioDto } from './dto/query-inventario.dto';
import { CreatePreReservaInventarioDto } from './dto/create-pre-reserva-inventario.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get('inventario')
  async getInventario(@Query() query: QueryInventarioDto) {
    return this.productosService.getInventario(query);
  }

  @Get('inventario/producto-con-ubicaciones')
  async getInventarioProductoConUbicaciones(@Query('nombre_producto') nombreProducto: string) {
    return this.productosService.getInventarioProductoConUbicaciones(nombreProducto);
  }

  @Get('inventarios')
  async getInventarioGeneral(@Query() query: QueryInventarioDto) {
    return this.productosService.getInventario(query);
  }

  @Post('movimientos-inventario/entradas')
  async crearEntradaInventario(@Body() dto: CreateEntradaInventarioDto) {
    return this.productosService.crearEntradaInventario(dto);
  }

  @Post('movimientos-inventario/pre-reservas')
  async crearPreReservaInventario(@Body() dto: CreatePreReservaInventarioDto) {
    return this.productosService.crearPreReservaInventario(dto);
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

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async updateProduct(
    @Param('id') id: string,
    @Body('product') productoStr: string,
    @UploadedFiles() files: any[],
  ): Promise<any> {
    try {
      const producto = JSON.parse(productoStr);
      return await this.productosService.updateProduct(id, producto, files);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('files', 25))
  async uploadImages(@UploadedFiles() files: any[]): Promise<any> {
    // Asegurarse de que files es un array
    if (!files) {
      files = [];
    } else if (!Array.isArray(files)) {
      files = [files];
    }
    return this.productosService.uploadImages(files);
  }

  @Get('archivos-imagenes')
  async getImageFiles() {
    return this.productosService.getImageFiles();
  }

  @Get('bodegas/:id')
  async getBodega(@Param('id') id: string) {
    return this.productosService.getBodega(id);
  }
}
