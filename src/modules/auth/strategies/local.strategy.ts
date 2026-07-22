import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'identifier',
      passwordField: 'senha',
    });
  }

  async validate(identifier: string, senha: string) {
    const result = await this.authService.validateAndLogin({ identifier, senha });
    return result.user;
  }
}
