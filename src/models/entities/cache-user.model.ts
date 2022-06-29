import { GameMode } from '../enums/game-mode.enum';

export interface User {
  gameMode: GameMode;
  startBalance: number;
  balance: number;
}
