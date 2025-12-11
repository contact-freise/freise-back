import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtUser, UserRequest } from 'src/middleware/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<UserRequest>();
    const authToken = request.headers['authorization'];

    if (!authToken) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const user = this.jwtService.verify<JwtUser>(authToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

