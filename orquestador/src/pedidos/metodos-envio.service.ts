import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class MetodosEnvioService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  findAll(): Observable<any[]> {
    const api = this.configService.get<string>('URL_PEDIDOS');
    const apiEndPoint = `${api}/metodos-envio`;
    return this.httpService.get<any[]>(apiEndPoint).pipe(map(res => res.data));
  }
}
