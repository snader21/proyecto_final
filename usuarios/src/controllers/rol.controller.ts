import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RolService } from '../services/rol.service';
import { CreateRolDto } from '../dto/create-rol.dto';

@Controller('roles')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Get()
  findAll() {
    return this.rolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolService.create(createRolDto);
  }
}
