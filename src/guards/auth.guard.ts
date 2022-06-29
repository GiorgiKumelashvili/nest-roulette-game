import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtHelper } from 'src/commons/jwt-helper';
import { GameMode } from 'src/models/enums/game-mode.enum';

type TempType = { gameMode: GameMode };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtHelper: JwtHelper) {}

  public canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    // first check body if it contains gamemode
    if (!Object.values(GameMode).includes(request.body?.gameMode)) {
      throw new BadRequestException(
        'missing/incorrect gameMode from request body',
      );
    }

    if ((request.body as TempType).gameMode === GameMode.TESTING) {
      return true;
    }

    const secretToken = this.jwtHelper.getToken(request);

    return this.jwtHelper.validateSecretToken(secretToken);
  }
}
