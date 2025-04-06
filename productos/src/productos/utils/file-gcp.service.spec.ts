import { Test, TestingModule } from '@nestjs/testing';
import { FileGCP } from './file-gcp.service';
import { GCPConfigService } from '../../common/services/gcp-config.service';
import { Storage, Bucket, File } from '@google-cloud/storage';
import { UploadedFile } from '../interfaces/uploaded-file.interface';
import { Writable } from 'stream';
import { ConfigService } from '@nestjs/config';

jest.mock('@google-cloud/storage');
jest.mock('stream');

describe('FileGCP', () => {
  let service: FileGCP;
  let mockStorage: jest.Mocked<Storage>;
  let mockBucket: jest.Mocked<Bucket>;
  let mockFile: jest.Mocked<File>;
  let mockWriteStream: jest.Mocked<Writable>;

  const mockGcpConfigService = {
    getCredentials: jest.fn().mockReturnValue({
      projectId: 'test-project',
      credentials: { client_email: 'test@test.com', private_key: 'test-key' },
    }),
    getBucketName: jest.fn().mockReturnValue('test-bucket'),
  };

  beforeEach(async () => {
    mockWriteStream = {
      write: jest.fn().mockImplementation((chunk: any, encoding: string, callback: (error?: Error | null) => void) => {
        callback();
        return true;
      }),
      end: jest.fn().mockImplementation((callback?: () => void) => {
        if (callback) {
          callback();
        }
        return mockWriteStream;
      }),
      on: jest.fn(),
      once: jest.fn(),
      emit: jest.fn(),
    } as unknown as jest.Mocked<Writable>;

    mockFile = {
      createWriteStream: jest.fn().mockReturnValue(mockWriteStream),
      exists: jest.fn().mockResolvedValue([true] as any),
      download: jest.fn().mockResolvedValue([Buffer.from('test')] as any),
      getSignedUrl: jest.fn().mockResolvedValue(['https://signed-url.com'] as any),
      name: 'test.jpg',
      bucket: {} as Bucket,
      storage: {} as Storage,
    } as unknown as jest.Mocked<File>;

    mockBucket = {
      file: jest.fn().mockReturnValue(mockFile),
      name: 'test-bucket',
      storage: {} as Storage,
      acl: {} as any,
      iam: {} as any,
    } as unknown as jest.Mocked<Bucket>;

    mockStorage = {
      bucket: jest.fn().mockReturnValue(mockBucket),
      acl: {},
      getBucketsStream: jest.fn(),
      getHmacKeysStream: jest.fn(),
      crc32cGenerator: jest.fn(),
    } as unknown as jest.Mocked<Storage>;

    const StorageMock = jest.fn(() => mockStorage);
    (Storage as unknown) = StorageMock;

    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'GCP_PROJECT_ID':
            return 'test-project';
          case 'GCP_CLIENT_EMAIL':
            return 'test@example.com';
          case 'GCP_PRIVATE_KEY':
            return 'test-key';
          case 'GCP_BUCKET_NAME':
            return 'test-bucket';
          default:
            return '';
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileGCP,
        {
          provide: GCPConfigService,
          useValue: mockGcpConfigService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<FileGCP>(FileGCP);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUrl', () => {
    it('should generate signed url', async () => {
      const result = await service.getUrl('test/test.jpg');
      expect(result).toBe('https://signed-url.com');
      expect(mockFile.getSignedUrl).toHaveBeenCalled();
    });
  });
});
