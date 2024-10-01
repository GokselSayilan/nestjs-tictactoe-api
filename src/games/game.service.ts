import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './models/game.model';
import { MakeMoveDto } from './dto/make-move.dto';
import { User } from 'src/users/models/user.model';
import { Op } from 'sequelize';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game) private gameModel: typeof Game,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  // Tüm oyunları getir
  async getAllGames(): Promise<Game[]> {
    return await this.gameModel.findAll();
  }

  // Id'ye göre oyunu getir
  async getGameById(gameId: number): Promise<Game> {
    const targetGame = await this.gameModel.findByPk(gameId);
    if (!targetGame) {
      // return 0
      throw new NotFoundException('Oyun bulunamadı.');
      // throw new HttpException('custom', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return targetGame;
  }

  // Yeni bir oyun oluşturma
  async createGame(roomId: number): Promise<Game> {
    const newGame = await this.gameModel.create({
      roomId,
      boardState: '---------', // Boş bir tahta durumu
      status: 'waiting', // Oyun durumu başlangıçta 'waiting' olacak
    });
    return newGame;
  }

  // Oyuna bir oyuncu ekleme (Player 1 veya Player 2)
  async joinGame(gameId: number, userId: number): Promise<Game> {
    const game = await this.gameModel.findByPk(gameId);
    const user = await this.userModel.findByPk(userId);

    if (!game) {
      throw new NotFoundException('Oyun bulunamadı!');
    }

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı!');
    }

    // Kullanıcının zaten başka bir oyunda olup olmadığını kontrol et
    const existingGame = await this.gameModel.findOne({
      where: {
        [Op.or]: [{ player1Id: userId }, { player2Id: userId }],
      },
    });

    if (existingGame) {
      throw new BadRequestException('Kullanıcı zaten başka bir oyunda!');
    }

    if (!game.player1Id) {
      // Eğer player1 yoksa bu kullanıcı player1 olacak
      game.player1Id = userId;
      game.currentTurn = userId; // İlk giren oyuncu olduğu için sıra onda başlar
    } else if (!game.player2Id) {
      // Eğer player1 varsa ama player2 yoksa bu kullanıcı player2 olacak
      game.player2Id = userId;
    } else {
      // Oyun zaten dolmuş
      throw new BadRequestException('Oda da yer yok!');
    }

    await game.save(); // Güncellenmiş oyunu kaydediyoruz
    return game;
  }

  // Hamle yapma işlemi
  async makeMove(
    gameId: number,
    userId: number,
    makeMoveDto: MakeMoveDto,
  ): Promise<Game> {
    const game = await this.gameModel.findByPk(gameId);
    const user = await this.userModel.findByPk(userId);

    if (!game) {
      throw new NotFoundException('Oyun bulunamadı.');
    }

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı!');
    }

    if (!game.player1Id || !game.player2Id) {
      throw new BadRequestException('Tüm oyuncular gelmeden hamle yapılamaz!');
    }

    // Oyuncunun bu oyunda olup olmadığını kontrol et
    if (game.player1Id !== userId && game.player2Id !== userId) {
      throw new BadRequestException('Bu oyunun bir parçası değilsiniz.');
    }

    // Sıra kontrolü
    if (
      (game.currentTurn === game.player1Id && game.player1Id !== userId) ||
      (game.currentTurn === game.player2Id && game.player2Id !== userId)
    ) {
      throw new BadRequestException('Sıra sizde değil.');
    }

    // Tahta durumunu al ve hamleyi yap
    let boardState: string[] = game.boardState.split('');
    const { cellIndex } = makeMoveDto;

    // Hücrenin boş olup olmadığını kontrol et
    if (boardState[cellIndex] !== '-') {
      throw new BadRequestException('Bu hücre zaten dolu.');
    }

    // Hamleyi yap (X veya O)
    boardState[cellIndex] = game.currentTurn === game.player1Id ? 'X' : 'O';

    // Güncellenmiş tahta durumunu sakla
    game.boardState = boardState.join('');

    // Kazananı kontrol et ve oyunu bitir
    await this.checkWinnerAndEndGame(game);

    // Sıra değişimi
    game.currentTurn =
      game.currentTurn === game.player1Id ? game.player2Id : game.player1Id;

    await game.save();
    return game;
  }

  // Kazananı kontrol eden ve oyunu bitiren metot
  async checkWinnerAndEndGame(game: Game): Promise<void> {
    const board = game.boardState.split('');

    // Kazanma kombinasyonları
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Yatay
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Dikey
      [0, 4, 8],
      [2, 4, 6], // Çapraz
    ];

    let winner = null;

    // Kazananı kontrol et
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] !== '-' && board[a] === board[b] && board[a] === board[c]) {
        winner = board[a]; // 'X' ya da 'O'
        break;
      }
    }

    if (winner) {
      game.status = `Game Over - Winner: ${winner === 'X' ? 'Player 1' : 'Player 2'}`;
      game.player1 = null;
      game.player2 = null;
      game.currentTurn = null;
      await game.save();
    } else if (!board.includes('-')) {
      // Beraberlik durumu
      game.status = 'Game Over - Draw';
      game.player1 = null;
      game.player2 = null;
      game.currentTurn = null;
      await game.save();
    }
  }
}
