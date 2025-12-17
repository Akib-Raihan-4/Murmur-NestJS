import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Murmur } from "src/entities/murmur.entity";
import { Repository } from "typeorm";
import { IMurmurResponse } from "./murmur.interface";
import {
  IPaginatedResponse,
  IPaginationParams,
} from "src/common/interfaces/pagination.interface";

@Injectable()
export class MurmurService {
  constructor(
    @InjectRepository(Murmur)
    private murmurRepository: Repository<Murmur>
  ) {}

  async create(userId: number, text: string): Promise<IMurmurResponse> {
    const murmur = this.murmurRepository.create({
      text,
      userId,
    });

    const saved = await this.murmurRepository.save(murmur);

    const fullMurmur = await this.murmurRepository.findOne({
      where: { id: saved.id },
      relations: ["user", "likes"],
    });

    return {
      id: fullMurmur.id,
      text: fullMurmur.text,
      createdAt: fullMurmur.createdAt,
      author: {
        id: fullMurmur.user.id,
        username: fullMurmur.user.username,
        name: fullMurmur.user.name,
      },
      likesCount: fullMurmur.likes?.length || 0,
    };
  }

  async getMyMurmurs(
    userId: number,
    { page = 1, limit = 10 }: IPaginationParams
  ): Promise<IPaginatedResponse<IMurmurResponse[]>> {
    const skip = (page - 1) * limit;

    const [murmurs, total] = await this.murmurRepository.findAndCount({
      where: { userId },
      relations: ["user", "likes"],
      order: { createdAt: "DESC" },
      take: limit,
      skip,
    });

    if (murmurs.length === 0 && page > 1) {
      throw new NotFoundException("Page not found");
    }

    const data: IMurmurResponse[] = murmurs.map((m) => ({
      id: m.id,
      text: m.text,
      createdAt: m.createdAt,
      author: {
        id: m.user.id,
        username: m.user.username,
        name: m.user.name,
      },
      likesCount: m.likes?.length || 0,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        perPage: limit,
        hasNextPage: page < totalPages,
      },
    };
  }
}
