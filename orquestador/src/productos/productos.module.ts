import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { HttpModule } from '@nestjs/axios';
import { ProductosController } from './productos.controller';

@Module({
  imports: [HttpModule],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
