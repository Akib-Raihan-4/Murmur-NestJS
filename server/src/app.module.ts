import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { User } from "./entities/user.entity";
import { Murmur } from "./entities/murmur.entity";
import { Like } from "./entities/like.entitiy";
import { Follow } from "./entities/follow.entity";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { FollowModule } from "./follow/follow.module";
import { MurmurModule } from "./murmur/murmur.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "docker",
      password: "docker",
      database: "test",
      entities: [User, Murmur, Like, Follow],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Murmur, Like, Follow]),
    AuthModule,
    UsersModule,
    FollowModule,
    MurmurModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
