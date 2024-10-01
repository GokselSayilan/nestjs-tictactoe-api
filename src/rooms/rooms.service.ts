import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './models/room.model';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room) private roomModel: typeof Room) {}

  // Yeni oda oluşturma
  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = await this.roomModel.create(createRoomDto);
    return newRoom;
  }

  // Tüm odaları getirme
  async getAllRooms(): Promise<Room[]> {
    return await this.roomModel.findAll();
  }

  // ID'ye göre oda getirme
  async getRoomById(roomId: number): Promise<Room> {
    return await this.roomModel.findByPk(roomId);
  }

  // Oda güncelleme
  async updateRoom(
    roomId: number,
    updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    const room = await this.roomModel.findByPk(roomId);
    if (!room) {
      throw new Error('Oda bulunamadı.');
    }

    // Güncelleme islemleri
    room.roomName = updateRoomDto.roomName;

    await room.save();
    return room;
  }
}
