import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { RoomService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // Yeni oda oluşturma
  @Post('create')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomService.createRoom(createRoomDto);
  }

  // Tüm odaları getirme
  @Get()
  async getAllRooms() {
    return await this.roomService.getAllRooms();
  }

  // Belirli ID'ye göre oda getirme
  @Get(':roomId')
  async getRoomById(@Param('roomId', ParseIntPipe) roomId: number) {
    return await this.roomService.getRoomById(roomId);
  }

  // Oda güncelleme
  @Put('update/:roomId')
  async updateRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return await this.roomService.updateRoom(roomId, updateRoomDto);
  }
}
