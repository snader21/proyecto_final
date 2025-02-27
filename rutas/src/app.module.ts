import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CamionesModule } from './camiones/camiones.module';
import { RutasModule } from './rutas/rutas.module';
import { EstadosRutasModule } from './estados-rutas/estados-rutas.module';
import { NodosRutasModule } from './nodos-rutas/nodos-rutas.module';
import { TiposRutasModule } from './tipos-rutas/tipos-rutas.module';

@Module({
  imports: [CamionesModule, RutasModule, EstadosRutasModule, NodosRutasModule, TiposRutasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
