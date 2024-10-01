import {Module} from '@nestjs/common'
import { RoomController } from './room.controller';
import { RoomService } from './rooms.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './models/room.model';

@Module({
    imports:[SequelizeModule.forFeature([Room])],
    controllers:[RoomController],
    providers:[RoomService],
    exports:[]
})

export class RoomsModule {}