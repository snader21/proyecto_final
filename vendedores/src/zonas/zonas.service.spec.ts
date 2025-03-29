import { Test, TestingModule } from '@nestjs/testing';
import { ZonasService } from './zonas.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
describe('ZonasService', () => {
  let service: ZonasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ZonasService],
    }).compile();

    service = module.get<ZonasService>(ZonasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
