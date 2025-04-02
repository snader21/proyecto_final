import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermission = (module: string) =>
  SetMetadata(PERMISSIONS_KEY, module);
