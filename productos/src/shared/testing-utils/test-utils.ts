import { faker } from '@faker-js/faker/locale/es';

export const generarEntradaInventarioDto = (
  idProducto: string,
  idUbicacion: string,
) => ({
  idProducto,
  idUbicacion,
  cantidad: faker.number.int({ min: 1, max: 100 }),
  idUsuario: faker.string.uuid(),
  fechaRegistro: faker.date.recent().toISOString(),
});

export const camelCaseToSnakeCase = (str: string) => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};
