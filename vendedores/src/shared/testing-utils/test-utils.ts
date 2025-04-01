import { faker } from '@faker-js/faker/.';

export const generarVendedorDto = (zonaId: string) => ({
  nombre: faker.person.fullName(),
  correo: faker.internet.email(),
  telefono: faker.phone.number(),
  usuarioId: faker.string.uuid(),
  zonaId,
});
