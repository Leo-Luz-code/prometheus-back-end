import { SetMetadata } from '@nestjs/common';
import { Nivel } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Nivel[]) => SetMetadata(ROLES_KEY, roles);
