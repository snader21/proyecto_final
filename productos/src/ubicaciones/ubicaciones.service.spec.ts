import { Test, TestingModule } from '@nestjs/testing';
import { UbicacionesService } from './ubicaciones.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
describe('UbicacionesService', () => {
  let service: UbicacionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UbicacionesService],
    }).compile();

    service = module.get<UbicacionesService>(UbicacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
