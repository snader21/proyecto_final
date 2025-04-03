import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import { ConfigService } from '@nestjs/config';

const TOPIC_NAME = 'projects/intense-guru-453022-j0/topics/proyecto-final-topic';
const SUBSCRIPTION_NAME = 'projects/intense-guru-453022-j0/subscriptions/proyecto-final-topic-sub';

@Injectable()
export class PubSubService implements OnModuleInit {
  private pubSubClient: PubSub | null = null;
  private readonly projectId: string;
  private readonly keyFilename: string;

  constructor(private readonly configService: ConfigService) {
    this.projectId = this.configService.get<string>('GCP_PROJECT_ID') || '';
    this.keyFilename = this.configService.get<string>('GCP_KEY_FILE') || '';
    
    try {
      if (!this.projectId || !this.keyFilename) {
        throw new Error('Missing required PubSub configuration');
      }
      
      this.pubSubClient = new PubSub({
        projectId: this.projectId,
        keyFilename: this.keyFilename,
      });
    } catch (error) {
      console.error('Error initializing PubSub client:', error);
      throw new Error('Failed to initialize PubSub client');
    }
  }

  async onModuleInit() {
    if (!this.pubSubClient) {
      throw new Error('PubSub client not initialized');
    }
    // Inicializar suscripciones cuando el módulo arranca
    await this.initializeSubscriptions();
  }

  async publishMessage<T>(data: T): Promise<string> {
    if (!this.pubSubClient) {
      throw new Error('PubSub client not initialized');
    }
    const topic = this.pubSubClient.topic(TOPIC_NAME);
    const messageBuffer = Buffer.from(JSON.stringify(data));
    
    try {
      const messageId = await topic.publish(messageBuffer);
      console.log(`Mensaje publicado correctamente con ID: ${messageId}`);
      return messageId;
    } catch (error) {
      console.error('Error al publicar mensaje:', error);
      throw error;
    }
  }

  async subscribe<T>(messageHandler: (message: T) => Promise<void>) {
    if (!this.pubSubClient) {
      throw new Error('PubSub client not initialized');
    }
    const subscription = this.pubSubClient.subscription(SUBSCRIPTION_NAME);

    subscription.on('message', async (message) => {
      try {
        const data = JSON.parse(message.data.toString()) as T;
        await messageHandler(data);
        message.ack();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error al procesar mensaje: ${errorMessage}`);
        message.nack();
      }
    });

    subscription.on('error', (error: Error) => {
      console.error('Error en la suscripción:', error.message);
    });

    console.log(`Suscripción exitosa a ${SUBSCRIPTION_NAME}`);
  }

  private async initializeSubscriptions() {
    // Aquí puedes agregar la lógica para inicializar las suscripciones necesarias
    // Por ejemplo, suscribirse a eventos específicos al iniciar la aplicación
  }
}
