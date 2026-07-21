import { Nivel, Situacao } from '@prisma/client';

export type Usuario = {
  id: string;
  email: string;
  login: string;
  nivel: Nivel;
  situacao: Situacao;
  senha: string;
  refreshToken?: string;
};
