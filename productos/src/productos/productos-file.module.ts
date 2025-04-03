import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './entities/producto.entity';
import { ArchivoProductoEntity } from './entities/archivo-producto.entity';
import { ProductoFileProcessorService } from './services/producto-file-processor.service';
import { PubSubService } from '../common/services/pubsub.service';
import { MarcaValidator } from './validations/validators/marca.validator';
import { CategoriaValidator } from './validations/validators/categoria.validator';
import { UnidadMedidaValidator } from './validations/validators/unidad-medida.validator';
import { PaisValidator } from './validations/validators/pais.validator';
import { CategoriaEntity } from './entities/categoria.entity';
import { MarcaEntity } from './entities/marca.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { PaisEntity } from './entities/pais.entity';

interface FileProcessingMessage {
  archivoProductoId: string;
}

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductoEntity,
      ArchivoProductoEntity,
      CategoriaEntity,
      MarcaEntity,
      UnidadMedidaEntity,
      PaisEntity
    ]),
  ],
  providers: [
    ProductoFileProcessorService,
    PubSubService,
    MarcaValidator,
    CategoriaValidator,
    UnidadMedidaValidator,
    PaisValidator
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
    await this.pubSubService.subscribe<FileProcessingMessage>(async (message) => {
      await this.fileProcessor.processFile(message.archivoProductoId);
    });
  }
}
