import { Controller, Get, Param } from '@nestjs/common';
import { RolService } from '../services/rol.service';

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
}
