import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { CreateVendedorDto } from './dto/create-vendedor.dto';

@Controller('vendedores')
export class VendedoresController {
  constructor(private readonly vendedoresService: VendedoresService) {}

  @Post()
  crearVendedor(@Body() createVendedorDto: CreateVendedorDto) {
    return this.vendedoresService.crearVendedor(createVendedorDto);
  }

  @Get()
  findAll() {
    return this.vendedoresService.findAll();
  }

  @Get('zonas')
  getZonas() {
    return this.vendedoresService.getZonas();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendedoresService.findOne(id);
  }

  @Get('usuario/:id')
  findOneByUsuarioId(@Param('id') id: string) {
    return this.vendedoresService.findOneByUsuarioId(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendedoresService.remove(id);
  }

  @Patch(':id/usuario')
  updateUserVendedor(
    @Param('id') id: string,
    @Body() updateUserVendedorDto: any,
  ) {
    return this.vendedoresService.updateUserVendedor(id, updateUserVendedorDto);
  }
}
