import { Test, TestingModule } from '@nestjs/testing';
import { PlanVentasService } from './planVentas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlanVentasEntity } from './entities/plan-ventas.entity';
import { MetaTrimestralEntity } from './entities/meta-trimestral.entity';
import { TrimestreEntity } from './entities/trimestre.entity';
import { PlanVentasDto } from './dtos/plan-ventas.dto';
import { faker } from '@faker-js/faker';

jest.setTimeout(20000);

describe('PlanVentasService', () => {
  let service: PlanVentasService;
  let planVentasRepo: any;
  let metaTrimestralRepo: any;
  let trimestreRepo: any;

  const ano = 2025;
  const idVendedor = faker.string.uuid();

  beforeEach(async () => {
    planVentasRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    metaTrimestralRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    trimestreRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanVentasService,
        { provide: getRepositoryToken(PlanVentasEntity), useValue: planVentasRepo },
        { provide: getRepositoryToken(MetaTrimestralEntity), useValue: metaTrimestralRepo },
        { provide: getRepositoryToken(TrimestreEntity), useValue: trimestreRepo },
      ],
    }).compile();

    service = module.get<PlanVentasService>(PlanVentasService);
  });

  // No afterEach needed since everything is mocked


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deberia obtener trimestres por año correctamente', async () => {
    const trimestresMock = [
      { idQ: 'Q1', ano, fechaInicio: new Date(`${ano}-01-01`), fechaFin: new Date(`${ano}-03-31`) },
      { idQ: 'Q2', ano, fechaInicio: new Date(`${ano}-04-01`), fechaFin: new Date(`${ano}-06-30`) },
    ];
    trimestreRepo.find.mockResolvedValue(trimestresMock);
    const trimestres = await service.getTrimestresPorAno(ano);
    expect(trimestres).toEqual(trimestresMock);
    expect(trimestreRepo.find).toHaveBeenCalledWith({ where: { ano }, order: { idQ: 'ASC' } });
  });




  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deberia obtener trimestres por año correctamente', async () => {
    const trimestresMock = [
      { idQ: 'Q1', ano, fechaInicio: new Date(`${ano}-01-01`), fechaFin: new Date(`${ano}-03-31`) },
      { idQ: 'Q2', ano, fechaInicio: new Date(`${ano}-04-01`), fechaFin: new Date(`${ano}-06-30`) },
      { idQ: 'Q3', ano, fechaInicio: new Date(`${ano}-07-01`), fechaFin: new Date(`${ano}-09-30`) },
      { idQ: 'Q4', ano, fechaInicio: new Date(`${ano}-10-01`), fechaFin: new Date(`${ano}-12-31`) },
    ];

    trimestreRepo.find.mockResolvedValue(trimestresMock);

    const trimestres = await service.getTrimestresPorAno(ano);
    expect(trimestres).toBeDefined();
    expect(trimestres.length).toBe(4);
    expect(trimestres[0].idQ).toBe('Q1');
    expect(trimestres[3].idQ).toBe('Q4');
  });

  it('deberia obtener plan de ventas correctamente', async () => {
    const planId = faker.string.uuid();
    const planMock = {
      idPlan: planId,
      ano,
      idVendedor,
      metas: [
        { idMeta: faker.string.uuid(), idPlan: planId, idQ: 'Q1', ano, metaVenta: 10000 },
        { idMeta: faker.string.uuid(), idPlan: planId, idQ: 'Q2', ano, metaVenta: 15000 },
      ]
    };

    planVentasRepo.find.mockResolvedValue([planMock]);

    const planes = await service.getPlanVentas(idVendedor, ano);
    expect(planes).toBeDefined();
    expect(planes.length).toBeGreaterThan(0);
    expect(planes[0].metas.length).toBe(2);
  });

  it('deberia obtener todos los planes de ventas', async () => {
    const planId1 = faker.string.uuid();
    const planId2 = faker.string.uuid();

    const planesMock = [
      {
        idPlan: planId1,
        ano,
        idVendedor: faker.string.uuid(),
        metas: [
          { idMeta: faker.string.uuid(), idPlan: planId1, idQ: 'Q1', ano, metaVenta: 10000 }
        ]
      },
      {
        idPlan: planId2,
        ano,
        idVendedor: faker.string.uuid(),
        metas: [
          { idMeta: faker.string.uuid(), idPlan: planId2, idQ: 'Q1', ano, metaVenta: 15000 }
        ]
      }
    ];

    planVentasRepo.find.mockResolvedValue(planesMock);

    const planes = await service.getAllPlanesDeVentas();
    expect(planes).toBeDefined();
    expect(planes.length).toBeGreaterThan(0);
  });

  it('deberia crear o actualizar plan de ventas correctamente', async () => {
    const planVentasDto: PlanVentasDto = {
      ano,
      idVendedor,
      metas: [
        { idQ: 'Q1', ano, metaVenta: 10000, idVendedor },
        { idQ: 'Q2', ano, metaVenta: 15000, idVendedor },
      ],
    };

    // Mock para verificar trimestres
    const trimestreMock = { idQ: 'Q1', ano, fechaInicio: new Date(), fechaFin: new Date() };
    trimestreRepo.findOne.mockResolvedValue(trimestreMock);

    // Mock para buscar plan existente
    planVentasRepo.findOne.mockResolvedValue(null);

    // Mock para crear plan
    const planId = faker.string.uuid();
    const planCreatedMock = { idPlan: planId, ano, idVendedor };
    planVentasRepo.create.mockReturnValue(planCreatedMock);
    planVentasRepo.save.mockResolvedValue(planCreatedMock);

    // Mock para crear metas
    metaTrimestralRepo.create.mockReturnValue({});
    metaTrimestralRepo.save.mockResolvedValue({});

    // Mock para retornar plan actualizado
    const planFinalMock = {
      idPlan: planId,
      ano,
      idVendedor,
      metas: [
        { idMeta: faker.string.uuid(), idPlan: planId, idQ: 'Q1', ano, metaVenta: 10000 },
        { idMeta: faker.string.uuid(), idPlan: planId, idQ: 'Q2', ano, metaVenta: 15000 },
      ]
    };
    planVentasRepo.findOne.mockResolvedValue(planFinalMock);

    const planCreado = await service.createOrUpdatePlanVentas(planVentasDto);
    expect(planCreado).toBeDefined();
    expect(planCreado.ano).toBe(ano);
    expect(planCreado.idVendedor).toBe(idVendedor);
    expect(planCreado.metas.length).toBe(2);
  });

  it('deberia actualizar metas existentes correctamente', async () => {
    const planId = faker.string.uuid();

    // Actualizar metas
    const planVentasDto: PlanVentasDto = {
      ano,
      idVendedor,
      metas: [
        { idQ: 'Q1', ano, metaVenta: 15000, idVendedor },
        { idQ: 'Q2', ano, metaVenta: 20000, idVendedor },
      ],
    };

    // Mock para verificar trimestres
    const trimestreMock = { idQ: 'Q1', ano, fechaInicio: new Date(), fechaFin: new Date() };
    trimestreRepo.findOne.mockResolvedValue(trimestreMock);

    // Mock para buscar plan existente
    const planExistenteMock = { idPlan: planId, ano, idVendedor };
    planVentasRepo.findOne.mockResolvedValue(planExistenteMock);

    // Mock para buscar meta existente
    const metaExistenteMock = { idMeta: faker.string.uuid(), idPlan: planId, idQ: 'Q1', ano, metaVenta: 10000 };
    metaTrimestralRepo.findOne.mockResolvedValueOnce(metaExistenteMock);
    metaTrimestralRepo.findOne.mockResolvedValueOnce(null); // Para Q2 no existe

    // Mock para actualizar meta existente
    metaTrimestralRepo.save.mockResolvedValue({});

    // Mock para crear nueva meta
    metaTrimestralRepo.create.mockReturnValue({});

    // Mock para retornar plan actualizado
    const planFinalMock = {
      idPlan: planId,
      ano,
      idVendedor,
      metas: [
        { idMeta: faker.string.uuid(), idPlan: planId, idQ: 'Q1', ano, metaVenta: 15000 },
        { idMeta: faker.string.uuid(), idPlan: planId, idQ: 'Q2', ano, metaVenta: 20000 },
      ]
    };
    planVentasRepo.findOne.mockResolvedValue(planFinalMock);

    const planActualizado = await service.createOrUpdatePlanVentas(planVentasDto);
    expect(planActualizado.metas.length).toBe(2);
    const metaQ1 = planActualizado.metas.find(m => m.idQ === 'Q1');
    expect(metaQ1?.metaVenta).toBe(15000);
  });

  it('deberia lanzar error si el trimestre no existe', async () => {
    const planVentasDto: PlanVentasDto = {
      ano: ano,
      idVendedor,
      metas: [
        { idQ: 'Q5', ano, metaVenta: 10000, idVendedor }, // Trimestre inexistente
      ],
    };

    // Mock para verificar trimestre inexistente
    trimestreRepo.findOne.mockResolvedValue(null);

    await expect(service.createOrUpdatePlanVentas(planVentasDto)).rejects.toThrow(
      'El trimestre Q5 del año 2025 no existe'
    );
  });
});