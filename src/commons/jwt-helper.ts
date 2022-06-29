import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { environment } from 'src/enviroment';
import { TokenPayload } from 'src/models/common/token-payload.model';
import { ExceptionMessageCode } from '../models/enums/exception-message-code.enum';

@Injectable()
export class JwtHelper {
  constructor(private readonly jwtService: JwtService) {}

  public getToken(request: Request): string {
    // if gamemode is normal
    const authorizationHeader =
      request.headers['authorization'] || request.headers['Authorization'];

    if (!authorizationHeader) {
      throw new BadRequestException('missing authorization headers');
    }

    return authorizationHeader.slice('Bearer '.length).toString();
  }

  public getPayload(token: string): TokenPayload {
    return this.jwtService.decode(token) as TokenPayload;
  }

  public async validateSecretToken(secretToken: string): Promise<boolean> {
    if (!secretToken) {
      throw new UnauthorizedException(ExceptionMessageCode.MISSING_TOKEN);
    }

    await jwt.verify(
      secretToken,
      environment.accessTokenSecret,
      (err: jwt.VerifyErrors) => {
        if (err instanceof jwt.TokenExpiredError) {
          throw new UnauthorizedException(ExceptionMessageCode.EXPIRED_TOKEN);
        }

        if (err) {
          throw new UnauthorizedException(ExceptionMessageCode.INVALID_TOKEN);
        }
      },
    );

    return true;
  }
}
