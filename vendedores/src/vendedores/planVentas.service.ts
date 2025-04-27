import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrimestreEntity } from './entities/trimestre.entity';

@Injectable()
export class PlanVentasService {
  constructor(
    @InjectRepository(TrimestreEntity)
    private readonly trimestreRepository: Repository<TrimestreEntity>,
  ) {}

  async getTrimestresPorAno(ano: number): Promise<TrimestreEntity[]> {
    return this.trimestreRepository.find({ where: { ano }, order: { idQ: 'ASC' } });
  }
  
  async updatePlanVentas() {}





}
