import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../../entities/producto.entity';
import { ProductoValidator } from '../producto-validator.interface';

@Injectable()
export class SkuValidator implements ProductoValidator {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async validate(data: any) {
    if (!data.sku) {
      return {
        isValid: false,
        message: 'El SKU es requerido',
      };
    }

    const productoExistente = await this.productoRepository.findOne({
      where: { sku: data.sku }
    });

    if (productoExistente) {
      return {
        isValid: false,
        message: `Ya existe un producto con el SKU "${data.sku}"`,
      };
    }

    return {
      isValid: true,
    };
  }
}
