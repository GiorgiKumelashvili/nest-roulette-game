import { GameMode } from '../enums/game-mode.enum';

export interface UserProps {
  userId: number;
  gameMode: GameMode;
  balance: number;
}

export class User {
  public userId: number;
  public gameMode: GameMode;
  public startBalance: number;
  public balance: number;

  constructor({ balance, gameMode, userId }: UserProps) {
    this.userId = userId;
    this.gameMode = gameMode;
    this.balance = balance;

    // same as balance
    this.startBalance = balance;
  }
}
