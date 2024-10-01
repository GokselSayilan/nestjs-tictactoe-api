import {Module} from '@nestjs/common'
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { SequelizeModule } from '@nestjs/sequelize';

//models
import { Game } from './models/game.model';
import { User } from 'src/users/models/user.model';

@Module({
    imports:[SequelizeModule.forFeature([Game,User])],
    controllers:[GameController],
    providers:[GameService],
    exports:[]
})

export class GamesModule {

}