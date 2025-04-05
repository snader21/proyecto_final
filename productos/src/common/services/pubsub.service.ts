import { Injectable, Logger } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import { ConfigService } from '@nestjs/config';

const TOPIC_NAME = 'projects/intense-guru-453022-j0/topics/proyecto-final-topic';
const SUBSCRIPTION_NAME = 'projects/intense-guru-453022-j0/subscriptions/proyecto-final-topic-sub';

@Injectable()
export class PubSubService {
  private pubSubClient: PubSub | null = null;
  private readonly logger = new Logger(PubSubService.name);
  private enabled = false;

  constructor(private readonly configService: ConfigService) {
    const projectId = this.configService.get<string>('GCP_PROJECT_ID');
    const keyFilename = this.configService.get<string>('GCP_KEY_FILE');

    this.logger.debug('Configuración leída:', { 
      projectId: projectId || 'no configurado',
      keyFilename: keyFilename ? 'configurado' : 'no configurado'
    });

    if (!projectId || !keyFilename) {
      this.logger.warn('PubSub está deshabilitado: Faltan variables de entorno', {
        GCP_PROJECT_ID: projectId ? 'configurado' : 'falta',
        GCP_KEY_FILE: keyFilename ? 'configurado' : 'falta'
      });
      return;
    }

    try {
      this.pubSubClient = new PubSub({
        projectId,
        keyFilename,
      });
      this.enabled = true;
      this.logger.log('PubSub client inicializado correctamente');
      this.logger.log(`Project ID: ${projectId}`);
      this.logger.debug('Key File configurado en:', keyFilename);
    } catch (error) {
      this.logger.error('Error al inicializar PubSub client:', error);
      this.logger.warn('PubSub está deshabilitado debido a un error de inicialización');
    }
  }

  async publishMessage<T>(data: T): Promise<string | null> {
    if (!this.enabled || !this.pubSubClient) {
      this.logger.warn('Intento de publicar mensaje con PubSub deshabilitado');
      return null;
    }

    try {
      const topic = this.pubSubClient.topic(TOPIC_NAME);
      const messageBuffer = Buffer.from(JSON.stringify(data));
      const messageId = await topic.publish(messageBuffer);
      this.logger.log(`Mensaje publicado correctamente con ID: ${messageId}`);
      return messageId;
    } catch (error) {
      this.logger.error('Error al publicar mensaje:', error);
      throw error;
    }
  }

  async subscribe<T>(messageHandler: (message: T) => Promise<void>): Promise<void> {
    if (!this.enabled || !this.pubSubClient) {
      this.logger.warn('Intento de suscripción con PubSub deshabilitado');
      return;
    }

    try {
      const subscription = this.pubSubClient.subscription(SUBSCRIPTION_NAME);

      subscription.on('message', async (message) => {
        try {
          const data = JSON.parse(message.data.toString()) as T;
          await messageHandler(data);
          message.ack();
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.logger.error(`Error al procesar mensaje: ${errorMessage}`);
          message.nack();
        }
      });

      subscription.on('error', (error: Error) => {
        this.logger.error('Error en la suscripción:', error.message);
      });

      this.logger.log(`Suscripción exitosa a ${SUBSCRIPTION_NAME}`);
    } catch (error) {
      this.logger.error('Error al crear suscripción:', error);
      throw error;
    }
  }
}
