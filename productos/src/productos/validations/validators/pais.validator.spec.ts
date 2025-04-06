import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaisValidator } from './pais.validator';
import { PaisEntity } from '../../entities/pais.entity';

describe('PaisValidator', () => {
  let validator: PaisValidator;
  let mockPaisRepository: jest.Mocked<Repository<PaisEntity>>;

  beforeEach(async () => {
    mockPaisRepository = {
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaisValidator,
        {
          provide: getRepositoryToken(PaisEntity),
          useValue: mockPaisRepository,
        },
      ],
    }).compile();

    validator = module.get<PaisValidator>(PaisValidator);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return valid result when country exists', async () => {
      const mockPais = {
        id_pais: 'PAIS-1',
        nombre: 'Test Country',
      } as PaisEntity;

      mockPaisRepository.findOne.mockResolvedValue(mockPais);

      const row = { pais: 'Test Country' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(true);
      expect((row as any).paisId).toBe(mockPais.id_pais);
      expect(mockPaisRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should return invalid result when country does not exist', async () => {
      mockPaisRepository.findOne.mockResolvedValue(null);

      const row = { pais: 'Non-existent Country' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('El país "Non-existent Country" no existe en el sistema');
      expect(mockPaisRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should handle empty country', async () => {
      mockPaisRepository.findOne.mockResolvedValue(null);

      const row = {};
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('El país  no existe en el sistema');
      expect(mockPaisRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should handle null country', async () => {
      mockPaisRepository.findOne.mockResolvedValue(null);

      const row = { pais: null };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('El país  no existe en el sistema');
      expect(mockPaisRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should trim country name before searching', async () => {
      const mockPais = {
        id_pais: 'PAIS-1',
        nombre: 'Test Country',
      } as PaisEntity;

      mockPaisRepository.findOne.mockResolvedValue(mockPais);

      const row = { pais: '  Test Country  ' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(true);
      expect((row as any).paisId).toBe(mockPais.id_pais);
      expect(mockPaisRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });
  });
});
