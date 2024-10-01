import {
  Model,
  Column,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Room } from 'src/rooms/models/room.model';

@Table
export class Game extends Model<Game> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER
  })
  gameId: number;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.INTEGER
  })
  roomId: number;

  @BelongsTo(() => Room)
  room: Room;

  // Player 1 Foreign Key
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  player1Id: number;

  @BelongsTo(() => User, 'player1Id') // player1Id alanını açıkça belirtiyoruz
  player1: User;

  // Player 2 Foreign Key
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  player2Id: number;

  @BelongsTo(() => User, 'player2Id') // player2Id alanını açıkça belirtiyoruz
  player2: User;

  // Current Turn
  @Column({
    type: DataType.INTEGER,
  })
  currentTurn: number; // Bu, sırası gelen oyuncunun ID'sini temsil eder

  // Board State
  @Column({
    type: DataType.STRING,
  })
  boardState: string; // Oyun tahtasının durumunu tutar, örneğin "XOX-O--X-"

  // Game Status
  @Column({
    type: DataType.STRING,
  })
  status: string; // "ongoing", "finished", "draw" gibi oyunun durumunu belirtir
}
