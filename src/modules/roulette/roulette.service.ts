import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtHelper } from 'src/commons/jwt-helper';
import { CreateRequest } from 'src/models/dto/request/create.request';
import { GameMode } from 'src/models/enums/game-mode.enum';
import { RouletteRepository } from './roulette.repository';

@Injectable()
export class RouletteService {
  constructor(
    private readonly jwtHelper: JwtHelper,
    private readonly rouletteRepository: RouletteRepository,
  ) {}

  getBalance(request: Request, createRequest: CreateRequest) {
    if (createRequest.gameMode === GameMode.TESTING) {
      return createRequest.balance || 0;
    }

    // get balance from token
    const secretToken = this.jwtHelper.getToken(request);
    const payload = this.jwtHelper.getPayload(secretToken);
    return payload?.balance ? Number(payload.balance) : 0;
  }

  initializeSession(balance: number, userId: number, gameMode: GameMode) {
    // initialize session inside redis
    this.rouletteRepository.initializeSession(balance, userId, gameMode);
  }
}
