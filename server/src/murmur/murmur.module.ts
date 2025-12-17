import { Module } from "@nestjs/common";
import { MurmurService } from "./murmur.service";
import { MurmurController } from "./murmur.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Murmur } from "src/entities/murmur.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Murmur])],
  providers: [MurmurService],
  controllers: [MurmurController],
})
export class MurmurModule {}
