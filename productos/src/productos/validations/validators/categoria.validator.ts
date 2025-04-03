import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaEntity } from '../../entities/categoria.entity';
import { ProductoValidator, ProductoValidationResult } from '../producto-validator.interface';

@Injectable()
export class CategoriaValidator implements ProductoValidator {
  constructor(
    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,
  ) {}

  async validate(row: any): Promise<ProductoValidationResult> {
    const categoria = await this.categoriaRepository.findOne({
      where: { nombre: row.categoria }
    });

    if (!categoria) {
      return {
        isValid: false,
        message: `La categoría "${row.categoria}" no existe en el sistema`
      };
    }

    // Agregar el ID al row para usarlo en la creación del producto
    row.categoriaId = categoria.id_categoria;
    return { isValid: true };
  }
}
