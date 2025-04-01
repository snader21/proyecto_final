import { Test, TestingModule } from '@nestjs/testing';
import { VendedoresService } from './vendedores.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from '../usuarios/usuarios.module';

describe('VendedoresService', () => {
  let service: VendedoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({ isGlobal: true }),
        UsuariosModule,
      ],
      providers: [VendedoresService],
    }).compile();

    service = module.get<VendedoresService>(VendedoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
