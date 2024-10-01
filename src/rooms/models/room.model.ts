import {
  Table,
  Column,
  DataType,
  Model,
  AutoIncrement,
  PrimaryKey,
  HasOne,
  Unique,
} from 'sequelize-typescript';
import { Game } from 'src/games/models/game.model';

@Table
export class Room extends Model<Room> {
  @HasOne(() => Game) // Room'un bir Game'e sahip olduğunu belirtir
  game: Game;

  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
  })
  roomId: number;

  @Unique
  @Column({
    type: DataType.STRING,
  })
  roomName: string;
}
