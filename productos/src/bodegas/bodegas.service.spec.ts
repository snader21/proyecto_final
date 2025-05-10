import { Test, TestingModule } from '@nestjs/testing';
import { BodegasService } from './bodegas.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('BodegasService', () => {
  let service: BodegasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BodegasService],
    }).compile();

    service = module.get<BodegasService>(BodegasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
