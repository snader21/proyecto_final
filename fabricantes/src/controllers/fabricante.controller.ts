import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { FabricanteService } from '../services/fabricante.service';
import { CreateFabricanteDto } from '../dto/create-fabricante.dto';
import { UpdateFabricanteDto } from '../dto/update-fabricante.dto';

@Controller('fabricantes')
export class FabricanteController {
  constructor(private readonly fabricanteService: FabricanteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFabricanteDto: CreateFabricanteDto) {
    return this.fabricanteService.create(createFabricanteDto);
  }

  @Get()
  async findAll() {
    return this.fabricanteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.fabricanteService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.fabricanteService.remove(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFabricanteDto: UpdateFabricanteDto,
  ) {
    return this.fabricanteService.update(id, updateFabricanteDto);
  }
}
