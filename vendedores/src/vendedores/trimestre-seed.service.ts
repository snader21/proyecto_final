import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrimestreEntity } from './entities/trimestre.entity';

@Injectable()
export class TrimestreSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(TrimestreEntity)
    private readonly trimestreRepository: Repository<TrimestreEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.trimestreRepository.count();
    if (count === 0) {
      const year = 2025;
      const data = [
        { idQ: 'Q1', ano: year, fechaInicio: new Date(`${year}-01-01`), fechaFin: new Date(`${year}-03-31`) },
        { idQ: 'Q2', ano: year, fechaInicio: new Date(`${year}-04-01`), fechaFin: new Date(`${year}-06-30`) },
        { idQ: 'Q3', ano: year, fechaInicio: new Date(`${year}-07-01`), fechaFin: new Date(`${year}-09-30`) },
        { idQ: 'Q4', ano: year, fechaInicio: new Date(`${year}-10-01`), fechaFin: new Date(`${year}-12-31`) },
      ];
      await this.trimestreRepository.save(data);
      console.log('[TrimestreSeedService] Trimestres 2025 precargados');
    }
  }
}
