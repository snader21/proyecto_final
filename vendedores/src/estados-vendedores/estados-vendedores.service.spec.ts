import { Test, TestingModule } from '@nestjs/testing';
import { EstadosVendedoresService } from './estados-vendedores.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('EstadosVendedoresService', () => {
  let service: EstadosVendedoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstadosVendedoresService],
    }).compile();

    service = module.get<EstadosVendedoresService>(EstadosVendedoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
