import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtHelper } from 'src/commons/jwt-helper';
import { RouletteController } from './roulette.controller';
import { RouletteRepository } from './roulette.repository';
import { RouletteService } from './roulette.service';

@Module({
  imports: [JwtModule],
  providers: [JwtHelper, RouletteService, RouletteRepository],
  controllers: [RouletteController],
})
export class RouletteModule {}
