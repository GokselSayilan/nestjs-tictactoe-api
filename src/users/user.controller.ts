import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Yeni kullanıcı oluşturma
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  // Tüm kullanıcıları getirme
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  // Belirli ID'ye göre kullanıcı getirme
  @Get(':userId')
  async getUserById(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.userService.getUserById(userId);
  }

  // Kullanıcı güncelleme
  @Put('update/:userId')
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ){
    return await this.userService.updateUser(userId, updateUserDto);
  }
}
