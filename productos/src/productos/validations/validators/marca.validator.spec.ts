import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarcaValidator } from './marca.validator';
import { MarcaEntity } from '../../entities/marca.entity';

describe('MarcaValidator', () => {
  let validator: MarcaValidator;
  let mockMarcaRepository: jest.Mocked<Repository<MarcaEntity>>;

  beforeEach(async () => {
    mockMarcaRepository = {
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarcaValidator,
        {
          provide: getRepositoryToken(MarcaEntity),
          useValue: mockMarcaRepository,
        },
      ],
    }).compile();

    validator = module.get<MarcaValidator>(MarcaValidator);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return valid result when brand exists', async () => {
      const mockMarca = {
        id_marca: 'MAR-1',
        nombre: 'Test Brand',
      } as MarcaEntity;

      mockMarcaRepository.findOne.mockResolvedValue(mockMarca);

      const row: any = { marca: 'Test Brand' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(true);
      expect(row.marcaId).toBe(mockMarca.id_marca);
      expect(mockMarcaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should return invalid result when brand does not exist', async () => {
      mockMarcaRepository.findOne.mockResolvedValue(null);

      const row: any = { marca: 'Non-existent Brand' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('La marca "Non-existent Brand" no existe en el sistema');
      expect(mockMarcaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should handle empty brand', async () => {
      mockMarcaRepository.findOne.mockResolvedValue(null);

      const row: any = {};
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('La marca  no existe en el sistema');
      expect(mockMarcaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should handle null brand', async () => {
      mockMarcaRepository.findOne.mockResolvedValue(null);

      const row: any = { marca: null };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('La marca  no existe en el sistema');
      expect(mockMarcaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should trim brand name before searching', async () => {
      const mockMarca = {
        id_marca: 'MAR-1',
        nombre: 'Test Brand',
      } as MarcaEntity;

      mockMarcaRepository.findOne.mockResolvedValue(mockMarca);

      const row: any = { marca: '  Test Brand  ' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(true);
      expect(row.marcaId).toBe(mockMarca.id_marca);
      expect(mockMarcaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });
  });
});
