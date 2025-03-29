import { faker } from '@faker-js/faker/.';

export const generarVendedorDto = (estadoId: number, zonaId: number) => ({
  nombre: faker.person.fullName(),
  correo: faker.internet.email(),
  telefono: faker.phone.number(),
  usuarioId: faker.number.int({ min: 1, max: 100 }),
  estadoId,
  zonaId,
});
