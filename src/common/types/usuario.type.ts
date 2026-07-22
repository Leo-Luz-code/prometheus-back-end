import { Role } from '@prisma/client';

export type Usuario = {
  id: string;
  cpf: string;
  matricula: string;
  nome: string;
  email: string;
  role: Role;
  cargo: string;
  secretariaId: string;
  xpPoints: number;
  level: number;
  lgpdAccepted: boolean;
};
