import { IsNotEmpty, IsNumber } from 'class-validator';

export class BetItem {
  @IsNotEmpty()
  @IsNumber()
  betAmount: number;

  @IsNotEmpty()
  betType: number | 'odd' | 'even';
}
