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

  async getPlanVentas(idVendedor: string, ano: number) {
    return this.planVentasRepository.find({
      where: { ano, idVendedor },
      relations: ['metas'],
    });
  }

  async getAllPlanesDeVentas() {
    return this.planVentasRepository.find({
      relations: ['metas'],
    });
  }

  async createOrUpdatePlanVentas(
    planVentasDto: PlanVentasDto,
  ): Promise<PlanVentasEntity> {
    // Primero verificamos que existan los trimestres
    for (const meta of planVentasDto.metas) {
      const trimestre = await this.trimestreRepository.findOne({
        where: { idQ: meta.idQ, ano: meta.ano },
      });
      if (!trimestre) {
        throw new Error(
          `El trimestre ${meta.idQ} del año ${meta.ano} no existe`,
        );
      }
    }

    // Buscamos o creamos el plan de ventas
    let planVentas = await this.planVentasRepository.findOne({
      where: {
        ano: planVentasDto.ano,
        idVendedor: planVentasDto.idVendedor,
      },
    });

    if (!planVentas) {
      planVentas = this.planVentasRepository.create({
        ano: planVentasDto.ano,
        idVendedor: planVentasDto.idVendedor,
      });
      planVentas = await this.planVentasRepository.save(planVentas);
    }

    // Actualizamos las metas trimestrales
    for (const metaDto of planVentasDto.metas) {
      let meta = await this.metaTrimestralRepository.findOne({
        where: {
          idPlan: planVentas.idPlan,
          idQ: metaDto.idQ,
          ano: metaDto.ano,
        },
      });

      if (meta) {
        meta.metaVenta = metaDto.metaVenta;
        await this.metaTrimestralRepository.save(meta);
      } else {
        const newMeta = this.metaTrimestralRepository.create({
          idPlan: planVentas.idPlan,
          idQ: metaDto.idQ,
          ano: metaDto.ano,
          metaVenta: metaDto.metaVenta,
        });
        await this.metaTrimestralRepository.save(newMeta);
      }
    }

    // Retornamos el plan actualizado con sus metas
    const planActualizado = await this.planVentasRepository.findOne({
      where: { idPlan: planVentas.idPlan },
      relations: ['metas'],
    });

    if (!planActualizado) {
      throw new Error(
        `No se pudo encontrar el plan con id ${planVentas.idPlan}`,
      );
    }

    return planActualizado;
  }
}
