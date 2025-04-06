import { Test, TestingModule } from '@nestjs/testing';
import { PubSubService } from './pubsub.service';
import { GCPConfigService } from './gcp-config.service';
import { PubSub } from '@google-cloud/pubsub';

jest.mock('@google-cloud/pubsub');

describe('PubSubService', () => {
  let service: PubSubService;
  let gcpConfigService: jest.Mocked<GCPConfigService>;

  beforeEach(async () => {
    gcpConfigService = {
      getCredentials: jest.fn().mockReturnValue({
        projectId: 'test-project',
        credentials: {
          client_email: 'test@example.com',
          private_key: 'test-key',
        },
      }),
    } as unknown as jest.Mocked<GCPConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PubSubService,
        {
          provide: GCPConfigService,
          useValue: gcpConfigService,
        },
      ],
    }).compile();

    service = module.get<PubSubService>(PubSubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
