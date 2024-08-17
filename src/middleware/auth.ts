import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.model';
import { ConfigService } from '@nestjs/config';

export type UserRequest = Request & {
  user: User;
};

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async use(
    req: UserRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const authToken = req.headers['authorization'];
    if (!authToken) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const user = this.jwtService.verify(authToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      req.user = user;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
