import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoEntity } from './entities/producto.entity';
import { PaisEntity } from './entities/pais.entity';
import { CategoriaEntity } from './entities/categoria.entity';
import { MarcaEntity } from './entities/marca.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { BodegaEntity } from './entities/bodega.entity';
import { UbicacionEntity } from './entities/ubicacion.entity';
import { MovimientoInventarioEntity } from './entities/movimiento-inventario.entity';
describe('ProductosService', () => {
  let service: ProductosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(ProductoEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PaisEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CategoriaEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(MarcaEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UnidadMedidaEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(BodegaEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UbicacionEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(MovimientoInventarioEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
