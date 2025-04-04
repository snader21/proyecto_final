import { Test, TestingModule } from '@nestjs/testing';
import { InventariosService } from './inventarios.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
describe('InventariosService', () => {
  let service: InventariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventariosService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<InventariosService>(InventariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
