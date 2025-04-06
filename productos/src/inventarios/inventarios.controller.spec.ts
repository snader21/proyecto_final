import { Test, TestingModule } from '@nestjs/testing';
import { InventariosController } from './inventarios.controller';
import { InventariosService } from './inventarios.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
const mockInventariosService = {};

describe('InventariosController', () => {
  let controller: InventariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [InventariosController],
      providers: [
        { provide: InventariosService, useValue: mockInventariosService },
      ],
    }).compile();

    controller = module.get<InventariosController>(InventariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
