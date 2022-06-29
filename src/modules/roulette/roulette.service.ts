import { BadRequestException, Injectable } from '@nestjs/common';
import e, { Request } from 'express';
import { randomRouletteGen } from 'src/commons/helper';
import { JwtHelper } from 'src/commons/jwt-helper';
import { CreateRequest } from 'src/models/dto/request/create.request';
import { SpinRequest } from 'src/models/dto/request/spin/spin.request';
import { User } from 'src/models/entities/cache-user.model';
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

  async initializeSession(balance: number, userId: number, gameMode: GameMode) {
    const gameSession = await this.rouletteRepository.getGameSession(userId);

    if (gameSession) {
      return 'session is already initialized';
    }

    // initialize session inside redis
    this.rouletteRepository.initializeSession(balance, userId, gameMode);

    return null;
  }

  async isBalanceChecked(spinRequest: SpinRequest) {
    const { userId, betInfo, gameMode } = spinRequest;
    const gameSession = await this.rouletteRepository.getGameSession(userId);
    if (!gameSession) throw new BadRequestException('gamesession not found');

    const sum = betInfo.reduce((p, c) => p + c.betAmount, 0);
    let winningNumber = randomRouletteGen();

    if (sum > gameSession.balance) {
      throw new BadRequestException('not enough balance');
    }

    if (gameMode === GameMode.TESTING) {
      winningNumber = spinRequest.winningNumber || winningNumber;
    }

    // determine winnig
    const finalVal: Array<{ val: number; type: 'inc' | 'dec' }> = betInfo.map(
      (el) => {
        if (
          (el.betType === 'even' && winningNumber % 2 === 0) ||
          (el.betType === 'odd' && winningNumber % 2 === 1) ||
          el.betType === winningNumber
        ) {
          return { type: 'inc', val: el.betAmount * 2 };
        } else {
          return { type: 'dec', val: el.betAmount };
        }
      },
    );

    const amount = finalVal.reduce(
      (acc, curr) => (curr.type === 'inc' ? acc + curr.val : acc - curr.val),
      0,
    );

    return { amount, gameSession };

    console.clear();
    console.log(finalVal);
    console.log({ winningNumber });
    console.log(amount);
    console.log(gameSession.balance);
  }

  async updateBalance(
    spinRequest: SpinRequest,
    newBalance: number,
  ): Promise<User> {
    const { userId } = spinRequest;
    const gameSession = await this.rouletteRepository.getGameSession(userId);
    if (!gameSession) throw new BadRequestException('gamesession not found');

    // check if its less than 0 for user
    newBalance =
      gameSession.balance + newBalance < 0
        ? 0
        : gameSession.balance + newBalance;

    gameSession.balance = newBalance;
    await this.rouletteRepository.updateBalance(gameSession);
    return this.rouletteRepository.getGameSession(userId);
  }

  public async endSessions(userId: number) {
    const gameSession = await this.rouletteRepository.getGameSession(userId);

    if (gameSession) {
      await this.rouletteRepository.endSessions(userId);
    }
  }

  public getUserGameSession(userId: number): Promise<User> {
    return this.rouletteRepository.getGameSession(userId);
  }
}
