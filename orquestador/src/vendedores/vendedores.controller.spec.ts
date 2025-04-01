import { Test, TestingModule } from '@nestjs/testing';
import { VendedoresController } from './vendedores.controller';
import { VendedoresService } from './vendedores.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('VendedoresController', () => {
  let controller: VendedoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],
      controllers: [VendedoresController],
      providers: [VendedoresService],
    }).compile();

    controller = module.get<VendedoresController>(VendedoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
