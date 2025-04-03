import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarcaEntity } from '../../entities/marca.entity';
import { ProductoValidator, ProductoValidationResult } from '../producto-validator.interface';

@Injectable()
export class MarcaValidator implements ProductoValidator {
  constructor(
    @InjectRepository(MarcaEntity)
    private readonly marcaRepository: Repository<MarcaEntity>,
  ) {}

  async validate(row: any): Promise<ProductoValidationResult> {
    const marca = await this.marcaRepository.findOne({
      where: { nombre: row.marca }
    });

    if (!marca) {
      return {
        isValid: false,
        message: `La marca "${row.marca}" no existe en el sistema`
      };
    }

    return { isValid: true };
  }
}
