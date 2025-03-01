import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TiposRutasService } from './tipos-rutas.service';
import { CreateTipoRutaDto } from './dto/create-tipo-ruta.dto';
import { UpdateTipoRutaDto } from './dto/update-tipo-ruta.dto';

@Controller('tipos-rutas')
export class TiposRutasController {
  constructor(private readonly tiposRutasService: TiposRutasService) {}

  @Post()
  create(@Body() createTiposRutaDto: CreateTipoRutaDto) {
    return this.tiposRutasService.create(createTiposRutaDto);
  }

  @Get()
  findAll() {
    return this.tiposRutasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposRutasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTiposRutaDto: UpdateTipoRutaDto,
  ) {
    return this.tiposRutasService.update(+id, updateTiposRutaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposRutasService.remove(+id);
  }
}
