import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NodosProductosService } from './nodos-productos.service';
import { CreateNodoProductoDto } from './dto/create-nodo-producto.dto';
import { UpdateNodoProductoDto } from './dto/update-nodo-producto.dto';

@Controller('nodos-productos')
export class NodosProductosController {
  constructor(private readonly nodoProductoService: NodosProductosService) {}

  @Post()
  create(@Body() createNodoProductoDto: CreateNodoProductoDto) {
    return this.nodoProductoService.create(createNodoProductoDto);
  }

  @Get()
  findAll() {
    return this.nodoProductoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nodoProductoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNodoProductoDto: UpdateNodoProductoDto,
  ) {
    return this.nodoProductoService.update(+id, updateNodoProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nodoProductoService.remove(+id);
  }
}
