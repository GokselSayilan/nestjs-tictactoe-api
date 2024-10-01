import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { GameService } from './game.service';
import { MakeMoveDto } from './dto/make-move.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  // Tüm oyunları getir
  @Get()
  async getAllGames() {
    return await this.gameService.getAllGames();
  }

  @Get(':userId')
  async getGameById(@Param('userId', ParseIntPipe) userId: number) {
    return await this.gameService.getGameById(userId);
  }

  // Yeni bir oyun oluşturma
  @Post('create/:roomId')
  async createGame(@Param('roomId', ParseIntPipe) roomId: number) {
    return await this.gameService.createGame(roomId);
  }

  // Oyuna katılma
  @Post('join/:gameId/:userId')
  async joinGame(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.gameService.joinGame(gameId, userId);
  }

  // Hamle yapma
  @Post('move/:gameId/:userId')
  async makeMove(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() makeMoveDto: MakeMoveDto,
  ) {
    return await this.gameService.makeMove(gameId, userId, makeMoveDto);
  }
}
