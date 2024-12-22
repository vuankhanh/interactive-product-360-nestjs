import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ITokenPayload } from '../interface/token_payload.interface';
import { CustomUnauthorizedException } from '../exception/custom-exception';

@Injectable()
export class AuthGuard implements CanActivate {
  logger: Logger = new Logger(AuthGuard.name);
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new CustomUnauthorizedException();
    }
    try {
      const payload: ITokenPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['payload'] = payload;
    } catch (error) {
      this.logger.error(error.message);
      throw new CustomUnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.body.token || request.query.token || request.headers["x-access-token"] || request.headers['authorization']?.replace('Bearer ', '');
    return token;
  }
}