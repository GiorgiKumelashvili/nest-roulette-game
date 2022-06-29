import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RouletteController } from './roulette.controller';
import { RouletteRepository } from './roulette.repository';
import { RouletteService } from './roulette.service';

@Module({
  imports: [JwtModule],
  providers: [RouletteService, RouletteRepository],
  controllers: [RouletteController],
})
export class RouletteModule {}
