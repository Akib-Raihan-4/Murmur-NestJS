import { Module } from "@nestjs/common";
import { LikeService } from "./like.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "src/entities/like.entitiy";
import { Murmur } from "src/entities/murmur.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Like, Murmur])],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
