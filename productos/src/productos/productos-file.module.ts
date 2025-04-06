import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './entities/producto.entity';
import { ArchivoProductoEntity } from './entities/archivo-producto.entity';
import { ProductoFileProcessorService } from './services/producto-file-processor.service';
import { CategoriaEntity } from './entities/categoria.entity';
import { MarcaEntity } from './entities/marca.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { PaisEntity } from './entities/pais.entity';
import { MarcaValidator } from './validations/validators/marca.validator';
import { CategoriaValidator } from './validations/validators/categoria.validator';
import { UnidadMedidaValidator } from './validations/validators/unidad-medida.validator';
import { PaisValidator } from './validations/validators/pais.validator';
import { SkuValidator } from './validations/validators/sku.validator';
import { CommonModule } from '../common/common.module';
import { PubSubService } from '../common/services/pubsub.service';
import { FileGCP } from './utils/file-gcp.service';
import { HttpModule } from '@nestjs/axios';

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
      PaisEntity,
    ]),
    CommonModule,
    HttpModule,
  ],
  providers: [
    ProductoFileProcessorService,
    FileGCP,
    MarcaValidator,
    CategoriaValidator,
    UnidadMedidaValidator,
    PaisValidator,
    SkuValidator,
    {
      provide: 'PRODUCTO_VALIDATORS',
      useFactory: (
        skuValidator: SkuValidator,
        marcaValidator: MarcaValidator,
        categoriaValidator: CategoriaValidator,
        unidadMedidaValidator: UnidadMedidaValidator,
        paisValidator: PaisValidator,
      ) => [
        skuValidator,
        marcaValidator,
        categoriaValidator,
        unidadMedidaValidator,
        paisValidator,
      ],
      inject: [
        SkuValidator,
        MarcaValidator,
        CategoriaValidator,
        UnidadMedidaValidator,
        PaisValidator,
      ],
    },
  ],
  exports: [ProductoFileProcessorService],
})
export class ProductosFileModule implements OnModuleInit {
  private readonly logger = new Logger(ProductosFileModule.name);

  constructor(
    private readonly pubSubService: PubSubService,
    private readonly fileProcessor: ProductoFileProcessorService,
  ) {}

  async onModuleInit() {
    try {
      await this.pubSubService.subscribe<FileProcessingMessage>(
        async (message) => {
          try {
            await this.fileProcessor.processFile(message.archivoProductoId);
          } catch (error) {
            this.logger.error('Error procesando archivo:', error);
          }
        },
      );

      this.logger.log('Servicio de procesamiento de archivos iniciado');
    } catch (error) {
      this.logger.error(
        'Error al iniciar el servicio de procesamiento:',
        error,
      );
    }
  }
}
