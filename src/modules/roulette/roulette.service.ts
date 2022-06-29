import { Injectable } from '@nestjs/common';
import { RouletteRepository } from './roulette.repository';

@Injectable()
export class RouletteService {
  constructor(private readonly rouletteRepository: RouletteRepository) {}

  initializeSession() {
    console.log('Method not implemented.');
  }
}
