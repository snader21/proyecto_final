import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaisEntity } from '../../entities/pais.entity';
import { ProductoValidator, ProductoValidationResult } from '../producto-validator.interface';

@Injectable()
export class PaisValidator implements ProductoValidator {
  constructor(
    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,
  ) {}

  async validate(row: any): Promise<ProductoValidationResult> {
    const pais = await this.paisRepository.findOne({
      where: { nombre: row.pais }
    });

    if (!pais) {
      return {
        isValid: false,
        message: `El país "${row.pais}" no existe en el sistema`
      };
    }

    // Agregar el ID al row para usarlo en la creación del producto
    row.paisId = pais.id_pais;
    return { isValid: true };
  }
}
