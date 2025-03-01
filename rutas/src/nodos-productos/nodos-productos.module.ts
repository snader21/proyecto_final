import { Module } from '@nestjs/common';
import { NodosProductosService } from './nodos-productos.service';
import { NodosProductosController } from './nodos-productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodoProductoEntity } from './entities/nodo-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NodoProductoEntity])],
  controllers: [NodosProductosController],
  providers: [NodosProductosService],
  exports: [NodosProductosService],
})
export class NodosProductosModule {}
