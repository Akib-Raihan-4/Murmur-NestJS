import { Module } from "@nestjs/common";
import { MurmurService } from "./murmur.service";
import { MurmurController } from "./murmur.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Murmur } from "src/entities/murmur.entity";
import { LikeModule } from "src/like/like.module";

@Module({
  imports: [TypeOrmModule.forFeature([Murmur]), LikeModule],
  providers: [MurmurService],
  controllers: [MurmurController],
  exports: [MurmurService],
})
export class MurmurModule {}
