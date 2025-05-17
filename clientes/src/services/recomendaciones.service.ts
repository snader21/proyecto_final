/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import { GCPConfigService } from './gcp-config.service'; // Ajusta el path según tu estructura
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitaCliente } from 'src/entities/visita-cliente.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

@Injectable()
export class RecomendacionesService implements OnModuleInit {
  private readonly pubSubClient: PubSub;
  private readonly subscriptionName: string;

  constructor(
    @InjectRepository(VisitaCliente)
    private readonly visitaRepository: Repository<VisitaCliente>,
    private readonly gcpConfigService: GCPConfigService,
    private readonly configService: ConfigService,
  ) {
    this.pubSubClient = new PubSub(this.gcpConfigService.getCredentials());
    this.subscriptionName =
      this.configService.get<string>('GCP_SUBSCRIPTION_NAME') ||
      'recomendaciones-sub';
  }

  onModuleInit() {
    const subscription = this.pubSubClient.subscription(this.subscriptionName);

    subscription.on('message', async (message) => {
      try {
        const data = JSON.parse(message.data.toString());
        console.log('Mensaje recibido:', data);
        await this.generarRecomendacionDesdeVisita(data);
        message.ack();
      } catch (error) {
        console.error('Error procesando el mensaje:', error);
        message.nack();
      }
    });
    subscription.on('error', (err) => {
      console.error('Error en la suscripción Pub/Sub:', err);
    });
    console.log(
      `RecomendacionesService escuchando en: ${this.subscriptionName}`,
    );
  }

  private async generarRecomendacionDesdeVisita(data: any): Promise<void> {
    const { id_visita, archivo } = data;

    // Lógica provisional para el ejercicio academico, debera reemplazarse por el analisis del video
    const frases = [
      'Organiza los productos más vendidos cerca de la entrada para aumentar su visibilidad.',
      'Asegúrate de que los pasillos estén siempre despejados y bien iluminados.',
      'Agrupa los productos por categoría para facilitar la búsqueda del cliente.',
      'Usa señalización clara y visible para promociones y descuentos.',
      'Revisa que los productos estén ordenados por fecha de caducidad y rotación.',
      'Coloca los productos de alto margen a la altura de los ojos.',
      'Aprovecha los puntos calientes cerca de la caja para productos impulsivos.',
      'Mantén las vitrinas limpias y bien presentadas.',
      'Renueva la disposición de los productos cada semana para mantener el interés.',
      'Utiliza colores llamativos en las zonas de promoción.',
    ];

    const texto = faker.helpers.arrayElement(frases);

    // Actualiza la visita con la recomendación generada
    await this.visitaRepository.update(id_visita, {
      recomendacion: texto,
    });

    console.log(
      `Recomendación actualizada en la visita ${id_visita}, basada en el video: ${archivo}`,
    );
  }
}
