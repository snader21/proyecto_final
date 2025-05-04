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
import { UpdateVendedorDto } from './dto/update-vendedore.dto';
import { UUIDParamDto } from '../shared/dto/id-param.dto';
import { UserVendedorDto } from './dto/update-user-vendedor.dto';

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
  findOne(@Param() params: UUIDParamDto) {
    return this.vendedoresService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: UUIDParamDto,
    @Body() updateVendedoreDto: UpdateVendedorDto,
  ) {
    return this.vendedoresService.update(params.id, updateVendedoreDto);
  }

  @Delete(':id')
  remove(@Param() params: UUIDParamDto) {
    return this.vendedoresService.remove(params.id);
  }

  @Patch(':id/usuario')
  updateUserVendedor(
    @Param() params: UUIDParamDto,
    @Body() updateUserVendedorDto: UserVendedorDto,
  ) {
    return this.vendedoresService.updateUserVendedor(
      params.id,
      updateUserVendedorDto,
    );
  }
}
