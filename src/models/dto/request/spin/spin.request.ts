import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GameMode } from 'src/models/enums/game-mode.enum';
import { BetItem } from './bet';

export class SpinRequest {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(GameMode)
  gameMode: GameMode;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => BetItem)
  betInfo: BetItem[];

  @IsOptional()
  @IsNumber()
  winningNumber: number | undefined;
}
