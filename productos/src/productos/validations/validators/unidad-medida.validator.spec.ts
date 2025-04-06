import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnidadMedidaValidator } from './unidad-medida.validator';
import { UnidadMedidaEntity } from '../../entities/unidad-medida.entity';

describe('UnidadMedidaValidator', () => {
  let validator: UnidadMedidaValidator;
  let mockUnidadMedidaRepository: jest.Mocked<Repository<UnidadMedidaEntity>>;

  beforeEach(async () => {
    mockUnidadMedidaRepository = {
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnidadMedidaValidator,
        {
          provide: getRepositoryToken(UnidadMedidaEntity),
          useValue: mockUnidadMedidaRepository,
        },
      ],
    }).compile();

    validator = module.get<UnidadMedidaValidator>(UnidadMedidaValidator);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return valid result when unit exists', async () => {
      const mockUnidadMedida = {
        id_unidad_medida: 'UM-1',
        nombre: 'Test Unit',
      } as UnidadMedidaEntity;

      mockUnidadMedidaRepository.findOne.mockResolvedValue(mockUnidadMedida);

      const row = { unidad_medida: 'Test Unit' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(true);
      expect((row as any).unidadMedidaId).toBe(mockUnidadMedida.id_unidad_medida);
      expect(mockUnidadMedidaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should return invalid result when unit does not exist', async () => {
      mockUnidadMedidaRepository.findOne.mockResolvedValue(null);

      const row = { unidad_medida: 'Non-existent Unit' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('La unidad de medida "Non-existent Unit" no existe en el sistema');
      expect(mockUnidadMedidaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should handle empty unit', async () => {
      mockUnidadMedidaRepository.findOne.mockResolvedValue(null);

      const row = {};
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('La unidad de medida  no existe en el sistema');
      expect(mockUnidadMedidaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should handle null unit', async () => {
      mockUnidadMedidaRepository.findOne.mockResolvedValue(null);

      const row = { unidad_medida: null };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('La unidad de medida  no existe en el sistema');
      expect(mockUnidadMedidaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should trim unit name before searching', async () => {
      const mockUnidadMedida = {
        id_unidad_medida: 'UM-1',
        nombre: 'Test Unit',
      } as UnidadMedidaEntity;

      mockUnidadMedidaRepository.findOne.mockResolvedValue(mockUnidadMedida);

      const row = { unidad_medida: '  Test Unit  ' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(true);
      expect((row as any).unidadMedidaId).toBe(mockUnidadMedida.id_unidad_medida);
      expect(mockUnidadMedidaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });
  });
});
