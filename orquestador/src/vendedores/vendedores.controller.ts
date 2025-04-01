import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { UpdateVendedorDto } from './dto/update-vendedor.dto';

@Controller('vendedores')
export class VendedoresController {
  constructor(private readonly vendedoresService: VendedoresService) {}

  @Post()
  create(@Body() createVendedoreDto: CreateVendedorDto) {
    return this.vendedoresService.create(createVendedoreDto);
  }

  @Get()
  findAll() {
    return this.vendedoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendedoresService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVendedoreDto: UpdateVendedorDto,
  ) {
    return this.vendedoresService.update(+id, updateVendedoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendedoresService.remove(+id);
  }
}
