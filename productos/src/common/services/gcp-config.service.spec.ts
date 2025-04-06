import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GCPConfigService } from './gcp-config.service';
import { Observable } from 'rxjs';
import { ConfigChangeEvent } from '@nestjs/config/dist/interfaces';

describe('GCPConfigService', () => {
  let service: GCPConfigService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    configService = {
      get: jest.fn(),
      getOrThrow: jest.fn(),
      set: jest.fn(),
      setEnvFilePaths: jest.fn(),
      changes$: new Observable<ConfigChangeEvent>(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GCPConfigService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<GCPConfigService>(GCPConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCredentials', () => {
    it('should return credentials when all environment variables are set', () => {
      const mockProjectId = 'test-project';
      const mockClientEmail = 'test@example.com';
      const mockPrivateKey = '-----BEGIN PRIVATE KEY-----\\ntest\\n-----END PRIVATE KEY-----';

      configService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'GCP_PROJECT_ID':
            return mockProjectId;
          case 'GCP_CLIENT_EMAIL':
            return mockClientEmail;
          case 'GCP_PRIVATE_KEY':
            return mockPrivateKey;
          default:
            return '';
        }
      });

      const result = service.getCredentials();

      expect(result).toEqual({
        projectId: mockProjectId,
        credentials: {
          client_email: mockClientEmail,
          private_key: mockPrivateKey.replace(/\\n/g, '\n'),
        },
      });
    });

    it('should return default credentials when environment variables are not set', () => {
      configService.get.mockReturnValue('');

      const result = service.getCredentials();

      expect(result.projectId).toBe('intense-guru-453022-j0');
      expect(result.credentials?.client_email).toBe(
        '1083277898027-compute@developer.gserviceaccount.com',
      );
      expect(result.credentials?.private_key).toBeDefined();
    });
  });

  describe('getBucketName', () => {
    it('should return configured bucket name when environment variable is set', () => {
      const mockBucketName = 'test-bucket';
      configService.get.mockReturnValue(mockBucketName);

      const result = service.getBucketName();

      expect(result).toBe(mockBucketName);
    });

    it('should return default bucket name when environment variable is not set', () => {
      configService.get.mockReturnValue('');

      const result = service.getBucketName();

      expect(result).toBe('proyecto-final-ccp-bucket');
    });
  });
});
