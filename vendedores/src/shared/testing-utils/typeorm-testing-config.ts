/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendedorEntity } from '../../vendedores/entities/vendedor.entity';
import { ZonaEntity } from '../../zonas/entities/zona.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    // logging: ['query', 'error'],
    entities: [VendedorEntity, ZonaEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([VendedorEntity, ZonaEntity]),
];
