import { Role } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  secretariaId: string;
};

export type JwtRefreshPayload = JwtPayload & {
  refreshToken?: string;
};
