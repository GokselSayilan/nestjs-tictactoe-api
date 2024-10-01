import { IsNumber, Min, Max } from 'class-validator';

export class MakeMoveDto {
  @IsNumber()
  @Min(0)
  @Max(8)
  cellIndex: number; // 0'dan 8'e kadar olan hücre indeksini temsil eder
}
