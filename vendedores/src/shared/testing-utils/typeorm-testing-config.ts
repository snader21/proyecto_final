/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendedorEntity } from '../../vendedores/entities/vendedor.entity';
import { ZonaEntity } from '../../zonas/entities/zona.entity';

export function TypeOrmTestingConfig(entities: any[] = []) {
  return [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: entities.length ? entities : [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature(entities.length ? entities : [VendedorEntity, ZonaEntity]),
  ];
}
