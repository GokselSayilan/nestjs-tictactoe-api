import { IsString, IsOptional } from 'class-validator';

export class UpdateRoomDto {
  @IsString()
  roomName: string;
}
