import { Test, TestingModule } from '@nestjs/testing';
import { BodegasController } from './bodegas.controller';
import { BodegasService } from './bodegas.service';

const mockBodegasService = {};

describe('BodegasController', () => {
  let controller: BodegasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BodegasController],
      providers: [{ provide: BodegasService, useValue: mockBodegasService }],
    }).compile();

    controller = module.get<BodegasController>(BodegasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
