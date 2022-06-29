import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { environment } from 'src/enviroment';
import { CreateRequest } from 'src/models/dto/request/create.request';
import { DeleteRequest } from 'src/models/dto/request/delete.request';
import { SpinRequest } from 'src/models/dto/request/spin/spin.request';
import { CreateResponse } from 'src/models/dto/response/create.request';
import { DeleteResponse } from 'src/models/dto/response/delete.request';
import { SpinResponse } from 'src/models/dto/response/spin.request';
import { RouletteService } from './roulette.service';

@Controller()
export class RouletteController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly rouletteService: RouletteService,
  ) {}

  @Post('create')
  public async create(
    @Req() request: Request,
    @Body() createRequest: CreateRequest,
  ): Promise<CreateResponse> {
    // validation is done here because there are two variants to get the balance from token header or request body
    const balance = this.rouletteService.getBalance(request, createRequest);

    // initialize session
    const resp = await this.rouletteService.initializeSession(
      balance,
      createRequest.userId,
      createRequest.gameMode,
    );

    if (resp) return { message: resp };
    return { message: 'user game initialized' };
  }

  @Patch('spin')
  public async spin(@Body() spinRequest: SpinRequest): Promise<SpinResponse> {
    // check balance
    const { amount } = await this.rouletteService.isBalanceChecked(spinRequest);

    // determine outcome and update balance
    const updatedGameSession = await this.rouletteService.updateBalance(
      spinRequest,
      amount,
    );

    return { message: 'updated balance: ' + updatedGameSession.balance };
  }

  @Delete('end')
  public async end(
    @Body() deleteRequest: DeleteRequest,
  ): Promise<DeleteResponse> {
    const userGameSession = await this.rouletteService.getUserGameSession(
      deleteRequest.userId,
    );

    if (!userGameSession) {
      throw new BadRequestException('user game session not found');
    }

    await this.rouletteService.endSessions(deleteRequest.userId);

    return {
      startBalance: userGameSession.startBalance,
      endBalance: userGameSession.balance,
    };
  }

  // for testing gameMode still required
  @Get('/generate-token')
  public getToken(): string {
    return this.jwtService.sign(
      { balance: 1000 },
      {
        expiresIn: environment.accessTokenExpiration,
        secret: environment.accessTokenSecret,
      },
    );
  }
}
