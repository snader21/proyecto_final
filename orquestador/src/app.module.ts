import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RutasModule } from './rutas/rutas.module';

@Module({
  imports: [RutasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
