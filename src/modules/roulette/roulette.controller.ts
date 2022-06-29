import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { environment } from 'src/enviroment';
import { RouletteService } from './roulette.service';

@Controller()
export class RouletteController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly rouletteService: RouletteService,
  ) {}

  @Post('create')
  create() {
    // initialize session
    this.rouletteService.initializeSession();

    return 1;
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
    return this.jwtService.sign(
      { balance: 1000 },
      {
        expiresIn: environment.accessTokenExpiration,
        secret: environment.accessTokenSecret,
      },
    );
  }
}
