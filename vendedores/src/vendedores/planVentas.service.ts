import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanVentasEntity } from './entities/plan-ventas.entity';
import { MetaTrimestralEntity } from './entities/meta-trimestral.entity';
import { PlanVentasDto } from './dtos/plan-ventas.dto';
import { TrimestreEntity } from './entities/trimestre.entity';

@Injectable()
export class PlanVentasService {
  constructor(
    @InjectRepository(PlanVentasEntity)
    private readonly planVentasRepository: Repository<PlanVentasEntity>,
    @InjectRepository(MetaTrimestralEntity)
    private readonly metaTrimestralRepository: Repository<MetaTrimestralEntity>,
    @InjectRepository(TrimestreEntity)
    private readonly trimestreRepository: Repository<TrimestreEntity>,
  ) {}

  async getTrimestresPorAno(ano: number): Promise<TrimestreEntity[]> {
    return this.trimestreRepository.find({
      where: { ano },
      order: { idQ: 'ASC' },
    });
  }
  
  async createOrUpdatePlanVentas(planVentasDto: PlanVentasDto): Promise<PlanVentasEntity> {
    // 1. Buscar o crear PlanVentasEntity
    let planVentas = await this.planVentasRepository.findOne({
      where: { 
        ano: planVentasDto.ano, 
        idVendedor: planVentasDto.idVendedor 
      }
    });

    // Si no existe, crear uno nuevo
    if (!planVentas) {
      planVentas = this.planVentasRepository.create({
        ano: planVentasDto.ano,
        idVendedor: planVentasDto.idVendedor
      });
      planVentas = await this.planVentasRepository.save(planVentas);
    }

    // En este punto planVentas siempre existe y tiene un idPlan
    const idPlan = planVentas.idPlan;

    // 2. Procesar cada meta trimestral
    for (const metaDto of planVentasDto.metas) {
      // Buscar si existe la meta
      let meta = await this.metaTrimestralRepository.findOne({
        where: {
          idPlan,
          idQ: metaDto.idQ,
          ano: metaDto.ano
        }
      });

      // Actualizar o crear
      if (meta) {
        meta.metaVenta = metaDto.metaVenta;
        await this.metaTrimestralRepository.save(meta);
      } else {
        await this.metaTrimestralRepository.save({
          idPlan,
          idQ: metaDto.idQ,
          ano: metaDto.ano,
          metaVenta: metaDto.metaVenta
        });
      }
    }

    // 3. Retornar plan actualizado con metas
    const planActualizado = await this.planVentasRepository.findOne({
      where: { idPlan },
      relations: ['metas'],
    });

    if (!planActualizado) {
      throw new Error(`No se pudo encontrar el plan con id ${idPlan}`);
    }

    return planActualizado;
  }
}
