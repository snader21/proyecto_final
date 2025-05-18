import { Test, TestingModule } from '@nestjs/testing';
import { PlanVentasController } from './planVentas.controller';
import { PlanVentasService } from './planVentas.service';
import { faker } from '@faker-js/faker';
import { PlanVentasDto } from './dtos/plan-ventas.dto';

describe('PlanVentasController', () => {
  let controller: PlanVentasController;
  let service: PlanVentasService;

  const mockPlanVentasService = {
    getTrimestresPorAno: jest.fn(),
    createOrUpdatePlanVentas: jest.fn(),
    getPlanVentas: jest.fn(),
    getAllPlanesDeVentas: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanVentasController],
      providers: [
        {
          provide: PlanVentasService,
          useValue: mockPlanVentasService,
        },
      ],
    }).compile();

    controller = module.get<PlanVentasController>(PlanVentasController);
    service = module.get<PlanVentasService>(PlanVentasService);

    // Limpiar todos los mocks después de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTrimestresPorAno', () => {
    it('debería retornar los trimestres para un año específico', async () => {
      // Arrange
      const ano = 2025;
      const trimestres = [
        { idQ: 'Q1', ano, fechaInicio: new Date(`${ano}-01-01`), fechaFin: new Date(`${ano}-03-31`) },
        { idQ: 'Q2', ano, fechaInicio: new Date(`${ano}-04-01`), fechaFin: new Date(`${ano}-06-30`) },
        { idQ: 'Q3', ano, fechaInicio: new Date(`${ano}-07-01`), fechaFin: new Date(`${ano}-09-30`) },
        { idQ: 'Q4', ano, fechaInicio: new Date(`${ano}-10-01`), fechaFin: new Date(`${ano}-12-31`) },
      ];
      mockPlanVentasService.getTrimestresPorAno.mockResolvedValue(trimestres);

      // Act
      const result = await controller.getTrimestresPorAno(ano);

      // Assert
      expect(result).toEqual(trimestres);
      expect(mockPlanVentasService.getTrimestresPorAno).toHaveBeenCalledWith(ano);
    });
  });

  describe('updatePlanVentas', () => {
    it('debería crear o actualizar un plan de ventas', async () => {
      // Arrange
      const ano = 2025;
      const idVendedor = faker.string.uuid();
      const planVentasDto: PlanVentasDto = {
        ano,
        idVendedor,
        metas: [
          { idQ: 'Q1', ano, metaVenta: 10000, idVendedor },
          { idQ: 'Q2', ano, metaVenta: 15000, idVendedor },
        ],
      };

      const planCreado = {
        idPlan: faker.string.uuid(),
        ano,
        idVendedor,
        metas: [
          { idMeta: faker.string.uuid(), idPlan: faker.string.uuid(), idQ: 'Q1', ano, metaVenta: 10000 },
          { idMeta: faker.string.uuid(), idPlan: faker.string.uuid(), idQ: 'Q2', ano, metaVenta: 15000 },
        ],
      };
      mockPlanVentasService.createOrUpdatePlanVentas.mockResolvedValue(planCreado);

      // Act
      const result = await controller.updatePlanVentas(planVentasDto);

      // Assert
      expect(result).toEqual(planCreado);
      expect(mockPlanVentasService.createOrUpdatePlanVentas).toHaveBeenCalledWith(planVentasDto);
    });
  });

  describe('getPlanVentas', () => {
    it('debería retornar el plan de ventas para un vendedor y año específicos', async () => {
      // Arrange
      const ano = 2025;
      const idVendedor = faker.string.uuid();
      const planes = [
        {
          idPlan: faker.string.uuid(),
          ano,
          idVendedor,
          metas: [
            { idMeta: faker.string.uuid(), idPlan: faker.string.uuid(), idQ: 'Q1', ano, metaVenta: 10000 },
            { idMeta: faker.string.uuid(), idPlan: faker.string.uuid(), idQ: 'Q2', ano, metaVenta: 15000 },
          ],
        },
      ];
      mockPlanVentasService.getPlanVentas.mockResolvedValue(planes);

      // Act
      const result = await controller.getPlanVentas(idVendedor, ano);

      // Assert
      expect(result).toEqual(planes);
      expect(mockPlanVentasService.getPlanVentas).toHaveBeenCalledWith(idVendedor, ano);
    });
  });

  describe('getAllPlanesDeVentas', () => {
    it('debería retornar todos los planes de ventas', async () => {
      // Arrange
      const ano = 2025;
      const planes = [
        {
          idPlan: faker.string.uuid(),
          ano,
          idVendedor: faker.string.uuid(),
          metas: [
            { idMeta: faker.string.uuid(), idPlan: faker.string.uuid(), idQ: 'Q1', ano, metaVenta: 10000 },
          ],
        },
        {
          idPlan: faker.string.uuid(),
          ano,
          idVendedor: faker.string.uuid(),
          metas: [
            { idMeta: faker.string.uuid(), idPlan: faker.string.uuid(), idQ: 'Q1', ano, metaVenta: 15000 },
          ],
        },
      ];
      mockPlanVentasService.getAllPlanesDeVentas.mockResolvedValue(planes);

      // Act
      const result = await controller.getAllPlanesDeVentas();

      // Assert
      expect(result).toEqual(planes);
      expect(mockPlanVentasService.getAllPlanesDeVentas).toHaveBeenCalled();
    });
  });
});