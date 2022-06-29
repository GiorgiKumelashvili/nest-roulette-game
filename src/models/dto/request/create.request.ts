import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GameMode } from '../../enums/game-mode.enum';

export class CreateRequest {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(GameMode)
  gameMode: GameMode;

  @IsOptional()
  @IsNumber()
  balance: number | undefined;
}
