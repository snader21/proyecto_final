import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkuValidator } from './sku.validator';
import { ProductoEntity } from '../../entities/producto.entity';

describe('SkuValidator', () => {
  let validator: SkuValidator;
  let mockProductoRepository: jest.Mocked<Repository<ProductoEntity>>;

  beforeEach(async () => {
    mockProductoRepository = {
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkuValidator,
        {
          provide: getRepositoryToken(ProductoEntity),
          useValue: mockProductoRepository,
        },
      ],
    }).compile();

    validator = module.get<SkuValidator>(SkuValidator);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return valid result when SKU does not exist', async () => {
      mockProductoRepository.findOne.mockResolvedValue(null);

      const row = { sku: 'TEST-123' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(true);
      expect(mockProductoRepository.findOne).toHaveBeenCalledWith({
        where: { sku: 'TEST-123' },
      });
    });

    it('should return invalid result when SKU already exists', async () => {
      const mockProducto = {
        id_producto: 'PROD-1',
        sku: 'TEST-123',
      } as ProductoEntity;

      mockProductoRepository.findOne.mockResolvedValue(mockProducto);

      const row = { sku: 'TEST-123' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Ya existe un producto con el SKU "TEST-123"');
      expect(mockProductoRepository.findOne).toHaveBeenCalledWith({
        where: { sku: 'TEST-123' },
      });
    });

    it('should handle empty SKU', async () => {
      const row = {};
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('El SKU es requerido');
      expect(mockProductoRepository.findOne).not.toHaveBeenCalled();
    });

    it('should handle null SKU', async () => {
      const row = { sku: null };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('El SKU es requerido');
      expect(mockProductoRepository.findOne).not.toHaveBeenCalled();
    });

    it('should handle empty string SKU', async () => {
      const row = { sku: '' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('El SKU es requerido');
      expect(mockProductoRepository.findOne).not.toHaveBeenCalled();
    });

    it('should trim SKU before searching', async () => {
      mockProductoRepository.findOne.mockResolvedValue(null);

      const row = { sku: '  TEST-123  ' };
      const result = await validator.validate(row);

      expect(result.isValid).toBe(true);
      expect(mockProductoRepository.findOne).toHaveBeenCalledWith({
        where: { sku: '  TEST-123  ' },
      });
    });

    it('should handle repository errors', async () => {
      const mockError = new Error('Database error');
      mockProductoRepository.findOne.mockRejectedValue(mockError);

      const row = { sku: 'TEST-123' };
      await expect(validator.validate(row)).rejects.toThrow(mockError);
    });
  });
});
