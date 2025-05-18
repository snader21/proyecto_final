import { Test } from '@nestjs/testing';
import { RutasController } from './rutas.controller';
import { RutasService } from './rutas.service';
import { HttpModule } from '@nestjs/axios';

describe('RutasController', () => {
  let controller: RutasController;

  const mockRutasService = {
    obtenerListaRutas: jest.fn().mockResolvedValue([]),
    calcularYGuardarRutaDeEntregaDePedidos: jest.fn().mockResolvedValue([]),
    calcularYGuardarRutaDeVisitaDeVendedores: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [RutasController],
      providers: [
        {
          provide: RutasService,
          useValue: mockRutasService,
        },
      ],
    }).compile();

    controller = module.get(RutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('obtenerListaRutas', () => {
    it('should call RutasService.obtenerListaRutas', () => {
      const tipoRuta = 'visita';
      void controller.obtenerListaRutas(tipoRuta);
      expect(mockRutasService.obtenerListaRutas).toHaveBeenCalledWith(tipoRuta);
    });
  });

  describe('calcularYGuardarRutaEntregaDePedidos', () => {
    it('should call RutasService.calcularYGuardarRutaDeEntregaDePedidos', () => {
      void controller.calcularYGuardarRutaEntregaDePedidos();
      expect(mockRutasService.calcularYGuardarRutaDeEntregaDePedidos).toHaveBeenCalled();
    });
  });

  describe('calcularYGuardarRutaVisitaVendedores', () => {
    it('should call RutasService.calcularYGuardarRutaDeVisitaDeVendedores', () => {
      void controller.calcularYGuardarRutaVisitaVendedores();
      expect(mockRutasService.calcularYGuardarRutaDeVisitaDeVendedores).toHaveBeenCalled();
    });
  });
});
