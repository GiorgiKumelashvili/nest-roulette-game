import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { environment } from 'src/enviroment';
import { ExceptionMessageCode } from '../models/enums/exception-message-code.enum';

@Injectable()
export class JwtHelper {
  async validateSecretToken(secretToken: string): Promise<boolean> {
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
