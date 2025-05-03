import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CamionesService } from './camiones.service';
import { CreateCamionDto } from './dto/create-camion.dto';
import { UpdateCamionDto } from './dto/update-camion.dto';

@Controller('camiones')
export class CamionesController {
  constructor(private readonly camionesService: CamionesService) {}

  @Post()
  create(@Body() createCamioneDto: CreateCamionDto) {
    return this.camionesService.create(createCamioneDto);
  }

  @Get()
  findAll() {
    return this.camionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.camionesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCamioneDto: UpdateCamionDto) {
    return this.camionesService.update(+id, updateCamioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.camionesService.remove(+id);
  }
}
