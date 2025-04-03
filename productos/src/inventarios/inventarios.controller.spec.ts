import { Test, TestingModule } from '@nestjs/testing';
import { InventariosController } from './inventarios.controller';
import { InventariosService } from './inventarios.service';

const mockInventariosService = {};

describe('InventariosController', () => {
  let controller: InventariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
