import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { Permiso } from './entities/permiso.entity';
import { UsuarioController } from './controllers/usuario.controller';
import { UsuarioService } from './services/usuario.service';
import { InitService } from './services/init.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { RolController } from './controllers/rol.controller';
import { RolService } from './services/rol.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5435'),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'usuarios',
      entities: [Usuario, Rol, Permiso],
      synchronize: true,
      autoLoadEntities: true,
      dropSchema: false,
    }),
    TypeOrmModule.forFeature([Usuario, Rol, Permiso]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET ?? 'tu-secreto-seguro',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [
    AppController,
    UsuarioController,
    AuthController,
    RolController,
  ],
  providers: [AppService, UsuarioService, InitService, AuthService, RolService],
})
export class AppModule {}
