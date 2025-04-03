import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnidadMedidaEntity } from '../../entities/unidad-medida.entity';
import { ProductoValidator, ProductoValidationResult } from '../producto-validator.interface';

@Injectable()
export class UnidadMedidaValidator implements ProductoValidator {
  constructor(
    @InjectRepository(UnidadMedidaEntity)
    private readonly unidadMedidaRepository: Repository<UnidadMedidaEntity>,
  ) {}

  async validate(row: any): Promise<ProductoValidationResult> {
    const unidadMedida = await this.unidadMedidaRepository.findOne({
      where: { nombre: row.unidad_medida }
    });

    if (!unidadMedida) {
      return {
        isValid: false,
        message: `La unidad de medida "${row.unidad_medida}" no existe en el sistema`
      };
    }

    // Agregar el ID al row para usarlo en la creación del producto
    row.unidadMedidaId = unidadMedida.id_unidad_medida;
    return { isValid: true };
  }
}
