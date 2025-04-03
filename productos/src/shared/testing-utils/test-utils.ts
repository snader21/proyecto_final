import { faker } from '@faker-js/faker/.';
import { TipoMovimientoEnum } from '../../movimientos-inventario/enums/tipo-movimiento.enum';

export const generarMovimientoInventarioDto = (
  idProducto: string,
  idUbicacion: string,
  tipoMovimiento?: TipoMovimientoEnum,
  incluirPedido: boolean = true,
) => ({
  idProducto,
  idUbicacion,
  idPedido: incluirPedido ? faker.string.uuid() : undefined,
  cantidad: faker.number.int({ min: 1, max: 100 }),
  tipoMovimiento:
    tipoMovimiento ||
    faker.helpers.arrayElement(Object.values(TipoMovimientoEnum)),
  idUsuario: faker.string.uuid(),
  fechaRegistro: faker.date.recent().toISOString(),
});

export const camelCaseToSnakeCase = (str: string) => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};
