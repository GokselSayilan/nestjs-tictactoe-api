import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ConfigModule'i import edin
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './games/game.module';
import { UsersModule } from './users/user.module';
import { RoomsModule } from './rooms/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ConfigModule'u global olarak tanımlayın
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as any, // .env dosyasındaki değerleri kullan
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      autoLoadModels: true,
    }),
    GamesModule,
    UsersModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
