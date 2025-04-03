import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './entities/producto.entity';
import { ArchivoProductoEntity } from './entities/archivo-producto.entity';
import { ProductoFileProcessorService } from './services/producto-file-processor.service';
import { PubSubService } from '../common/services/pubsub.service';
import { MarcaValidator } from './validations/validators/marca.validator';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductoEntity,
      ArchivoProductoEntity
    ]),
  ],
  providers: [
    ProductoFileProcessorService,
    PubSubService,
    MarcaValidator
  ],
  exports: [ProductoFileProcessorService],
})
export class ProductosFileModule implements OnModuleInit {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly fileProcessor: ProductoFileProcessorService,
  ) {}

  async onModuleInit() {
    // Suscribirse al tópico cuando el módulo inicia
    await this.pubSubService.subscribe(
      'productos-file-processing',
      async (message) => {
        await this.fileProcessor.processFile(message.archivoProductoId);
      }
    );
  }
}
