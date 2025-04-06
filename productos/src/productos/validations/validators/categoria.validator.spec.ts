import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaValidator } from './categoria.validator';
import { CategoriaEntity } from '../../entities/categoria.entity';

describe('CategoriaValidator', () => {
  let validator: CategoriaValidator;
  let mockCategoriaRepository: jest.Mocked<Repository<CategoriaEntity>>;

  beforeEach(async () => {
    mockCategoriaRepository = {
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaValidator,
        {
          provide: getRepositoryToken(CategoriaEntity),
          useValue: mockCategoriaRepository,
        },
      ],
    }).compile();

    validator = module.get<CategoriaValidator>(CategoriaValidator);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return valid result when category exists', async () => {
      const mockCategoria = {
        id_categoria: 'CAT-1',
        nombre: 'Test Category',
      } as CategoriaEntity;

      mockCategoriaRepository.findOne.mockResolvedValue(mockCategoria);

      const row: any = { categoria: 'Test Category' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(true);
      expect(row.categoriaId).toBe(mockCategoria.id_categoria);
      expect(mockCategoriaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should return invalid result when category does not exist', async () => {
      mockCategoriaRepository.findOne.mockResolvedValue(null);

      const row: any = { categoria: 'Non-existent Category' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('La categoría "Non-existent Category" no existe en el sistema');
      expect(mockCategoriaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should handle empty category', async () => {
      mockCategoriaRepository.findOne.mockResolvedValue(null);

      const row: any = {};
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('La categoría  no existe en el sistema');
      expect(mockCategoriaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should handle null category', async () => {
      mockCategoriaRepository.findOne.mockResolvedValue(null);

      const row: any = { categoria: null };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('La categoría  no existe en el sistema');
      expect(mockCategoriaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });

    it('should trim category name before searching', async () => {
      const mockCategoria = {
        id_categoria: 'CAT-1',
        nombre: 'Test Category',
      } as CategoriaEntity;

      mockCategoriaRepository.findOne.mockResolvedValue(mockCategoria);

      const row: any = { categoria: '  Test Category  ' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(true);
      expect(row.categoriaId).toBe(mockCategoria.id_categoria);
      expect(mockCategoriaRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: expect.any(Object) },
      });
    });
  });
});
