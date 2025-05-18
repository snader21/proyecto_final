import { Test, TestingModule } from '@nestjs/testing';
import { RutasService } from './rutas.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ProveedorAiService } from '../proveedor-ai/proveedor-ai.service';
import { ClienteService } from '../clientes/services/cliente.service';
import { ProductosService } from '../productos/productos.service';
import { PedidosService } from '../pedidos/pedidos.service';
import { VisitaService } from '../clientes/services/visita.service';
import { of } from 'rxjs';

describe('RutasService', () => {
  let service: RutasService;


  const mockHttpService = {
    get: jest.fn()
      .mockReturnValue(of({ data: [] })),
    post: jest.fn()
      .mockReturnValue(of({ data: [] })),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://localhost:3004'),
  };

  const mockProveedorAiService = {
    enviarPrompt: jest.fn().mockResolvedValue({ content: '{}' }),
  };

  const mockClienteService = {
    obtenerCliente: jest.fn().mockResolvedValue({ id: '1', nombre: 'Cliente 1' }),
  };

  const mockProductosService = {
    findOne: jest.fn().mockResolvedValue({ id: '1', nombre: 'Producto 1' }),
  };

  const mockPedidosService = {
    findOne: jest.fn().mockResolvedValue({ id: '1', cliente: { id: '1' } }),
  };

  const mockVisitaService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        RutasService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: ProveedorAiService, useValue: mockProveedorAiService },
        { provide: ClienteService, useValue: mockClienteService },
        { provide: ProductosService, useValue: mockProductosService },
        { provide: PedidosService, useValue: mockPedidosService },
        { provide: VisitaService, useValue: mockVisitaService },
      ],
    }).compile();

    service = module.get<RutasService>(RutasService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: Fix these tests
  // describe('obtenerListaRutas', () => {
  //   it('should call the rutas service and return rutas', async () => {
  //     const mockRutas = [{ id: '1', tipo: 'visita' }];
  //     mockHttpService.get.mockReturnValue(of({ data: mockRutas }));

  //     const result = await service.obtenerListaRutas('visita');
  //     expect(result).toEqual(mockRutas);
  //     expect(mockHttpService.get).toHaveBeenCalledWith(
  //       `${mockConfigService.get()}/rutas`,
  //     );
  //   });
  // });

  // describe('calcularYGuardarRutaDeEntregaDePedidos', () => {
  //   it('should call the rutas service to create delivery routes', async () => {
  //     const mockResponse = [{ id: '1', tipo: 'entrega' }];
  //     mockHttpService.post.mockReturnValue(of({ data: mockResponse }));

  //     const result = await service.calcularYGuardarRutaDeEntregaDePedidos();
  //     expect(result).toEqual(mockResponse);
  //     expect(mockHttpService.post).toHaveBeenCalledWith(
  //       `${mockConfigService.get()}/rutas/entrega`,
  //       expect.any(Object),
  //     );
  //   });
  // });

  // describe('calcularYGuardarRutaDeVisitaDeVendedores', () => {
  //   it('should call the rutas service to create visit routes', async () => {
  //     const mockResponse = [{ id: '1', tipo: 'visita' }];
  //     mockHttpService.post.mockReturnValue(of({ data: mockResponse }));

  //     const result = await service.calcularYGuardarRutaDeVisitaDeVendedores();
  //     expect(result).toEqual(mockResponse);
  //     expect(mockHttpService.post).toHaveBeenCalledWith(
  //       `${mockConfigService.get()}/rutas/visita`,
  //       expect.any(Object),
  //     );
  //   });
  // });
});
