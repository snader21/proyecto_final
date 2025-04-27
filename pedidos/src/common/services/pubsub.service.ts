import { Injectable, Logger } from '@nestjs/common';
import { PubSub, Subscription } from '@google-cloud/pubsub';
import { GCPConfigService } from './gcp-config.service';

const TOPIC_NAME =
  'projects/intense-guru-453022-j0/topics/proyecto_final_reservas';

@Injectable()
export class PubSubService {
  private pubSubClient: PubSub | null = null;
  private readonly logger = new Logger(PubSubService.name);
  private enabled = false;

  constructor(private readonly gcpConfigService: GCPConfigService) {
    try {
      const config = this.gcpConfigService.getCredentials();
      if (
        !config.projectId ||
        !config?.credentials?.client_email ||
        !config?.credentials?.private_key
      ) {
        this.logger.error(
          'PubSub está deshabilitado: Faltan credenciales de GCP',
        );
        return;
      }

      this.pubSubClient = new PubSub(config);
      this.enabled = true;
      this.logger.log('PubSub client inicializado correctamente');
    } catch (error) {
      this.logger.error('Error al inicializar PubSub client:', error);
      this.logger.error(
        'PubSub está deshabilitado debido a un error de inicialización',
      );
    }
  }

  async publishMessage<T>(data: T): Promise<string | null> {
    if (!this.enabled || !this.pubSubClient) {
      this.logger.error('Intento de publicar mensaje con PubSub deshabilitado');
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

  async subscribe<T>(
    messageHandler: (message: T) => Promise<void>,
    subscriptionName: string,
  ): Promise<Subscription | null> {
    if (!this.enabled || !this.pubSubClient) {
      this.logger.error('Intento de suscripción con PubSub deshabilitado');
      return null;
    }

    try {
      const subscription = this.pubSubClient.subscription(subscriptionName);

      subscription.on('message', async (message) => {
        try {
          const data = JSON.parse(message.data.toString()) as T;
          await messageHandler(data);
          message.ack();
        } catch (error) {
          this.logger.error('Error al procesar mensaje:', error);
          message.nack();
        }
      });

      subscription.on('error', (error) => {
        this.logger.error('Error en la suscripción:', error);
      });

      this.logger.log(`Suscripción exitosa a ${subscriptionName}`);
      return subscription;
    } catch (error) {
      this.logger.error('Error al crear suscripción:', error);
      throw error;
    }
  }
}
