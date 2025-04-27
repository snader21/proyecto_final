import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';

@Injectable()
export class MetodosPagoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  findAll() {
    const api = this.configService.get<string>('URL_PEDIDOS');
    const apiEndPoint = `${api}/metodos-pago`;
    return this.httpService.get(apiEndPoint).pipe(map((resp) => resp.data));
  }
}
