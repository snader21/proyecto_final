import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { FileGCP } from './utils/file-gcp.service';

const mockFileGCP = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
};
describe('ProductosService', () => {
  let service: ProductosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        ProductosService,
        { provide: FileGCP, useValue: mockFileGCP },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
