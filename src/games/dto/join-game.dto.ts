import { IsNumber } from 'class-validator';

export class JoinGameDto {
  @IsNumber()
  userId: number;
}
