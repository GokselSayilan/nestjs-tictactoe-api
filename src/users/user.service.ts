import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  // Yeni kullanıcı oluşturma
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.userModel.create(createUserDto);
    return newUser;
  }

  // Tüm kullanıcıları getirme
  async getAllUsers(): Promise<User[]> {
    const allUsers = await this.userModel.findAll();
    return allUsers;
  }

  // ID'ye göre kullanıcı getirme
  async getUserById(userId: number): Promise<User> {
    const targetUser = await this.userModel.findByPk(userId);
    return targetUser;
  }

  // Kullanıcı güncelleme
  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const targetUser = await this.userModel.findByPk(userId);
    if (!targetUser) {
      throw new Error('Kullanıcı bulunamadı.');
    }

    // Güncellemeleri uygulama
    targetUser.username = updateUserDto.username;

    await targetUser.save();
    return targetUser;
  }
}
