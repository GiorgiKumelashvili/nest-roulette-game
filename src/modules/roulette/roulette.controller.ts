import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { environment } from 'src/enviroment';
import { CreateRequest } from 'src/models/dto/request/create.request';
import { RouletteService } from './roulette.service';

@Controller()
export class RouletteController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly rouletteService: RouletteService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('create')
  async create(@Req() request: Request, @Body() createRequest: CreateRequest) {
    // validation is done here because there are two variants to get the balance from token header or request body
    const balance = this.rouletteService.getBalance(request, createRequest);

    // initialize session
    await this.rouletteService.initializeSession(
      balance,
      createRequest.userId,
      createRequest.gameMode,
    );

    return { message: 'user game initialized' };
  }

  @Patch('spin')
  spin() {
    return 1;
  }

  @Delete('end')
  end() {
    return 1;
  }

  // for testing gameMode still required
  @Get('/generate-token')
  getToken() {
    // return this.cacheManager.get('1');

    return this.jwtService.sign(
      { balance: 1000 },
      {
        expiresIn: environment.accessTokenExpiration,
        secret: environment.accessTokenSecret,
      },
    );
  }
}
