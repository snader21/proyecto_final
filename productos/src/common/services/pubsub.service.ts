import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PubSubService implements OnModuleInit {
  private pubSubClient: PubSub;
  private readonly projectId: string;
  private readonly keyFilename: string;

  constructor(private readonly configService: ConfigService) {
    this.projectId = this.configService.get<string>('GCP_PROJECT_ID') || '';
    this.keyFilename = this.configService.get<string>('GCP_KEY_FILE') || '';
    
    this.pubSubClient = new PubSub({
      projectId: this.projectId,
      keyFilename: this.keyFilename
    });
  }

  async onModuleInit() {
    // Inicializar suscripciones cuando el módulo arranca
    await this.initializeSubscriptions();
  }

  async publishMessage(topicName: string, data: any) {
    const topic = this.pubSubClient.topic(topicName);
    const messageBuffer = Buffer.from(JSON.stringify(data));
    
    try {
      const messageId = await topic.publish(messageBuffer);
      console.log(`Message ${messageId} published.`);
      return messageId;
    } catch (error) {
      console.error('Error publishing message:', error);
      throw error;
    }
  }

  async subscribe(subscriptionName: string, messageHandler: (message: any) => Promise<void>) {
    const subscription = this.pubSubClient.subscription(subscriptionName);

    subscription.on('message', async (message) => {
      try {
        const data = JSON.parse(message.data.toString());
        await messageHandler(data);
        message.ack();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error processing message: ${errorMessage}`);
        message.nack();
      }
    });

    subscription.on('error', (error: Error) => {
      console.error('Subscription error:', error.message);
    });
  }

  private async initializeSubscriptions() {
    // Aquí inicializaremos todas las suscripciones necesarias
  }
}
