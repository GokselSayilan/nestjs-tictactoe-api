import {
  Model,
  Column,
  Table,
  DataType,
  HasOne,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
} from 'sequelize-typescript';
import { Game } from 'src/games/models/game.model';

@Table
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @Column({
    type: DataType.STRING,
  })
  username: string;

  // User olarak oynadığı tek oyun (Player 1)
  @HasOne(() => Game, 'player1Id')
  gameAsPlayer1: Game;

  // User olarak oynadığı tek oyun (Player 2)
  @HasOne(() => Game, 'player2Id')
  gameAsPlayer2: Game;
}
