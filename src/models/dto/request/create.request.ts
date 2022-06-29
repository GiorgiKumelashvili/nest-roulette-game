import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GameMode } from '../../enums/game-mode.enum';

export class CreateRequest {
  @IsNotEmpty()
  @IsString()
  @IsEnum(GameMode)
  gameMode: GameMode;

  @IsNotEmpty()
  @IsNumber()
  balance: number;
}
