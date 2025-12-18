import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
      isLiked: false,
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
      isLiked: m.likes?.some((like) => like.userId === userId) || false,
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

  async delete(murmurId: number, userId: number): Promise<void> {
    const murmur = await this.murmurRepository.findOne({
      where: { id: murmurId },
      select: ["id", "userId"],
    });

    if (!murmur) {
      throw new NotFoundException("Murmur not found");
    }

    if (murmur.userId !== userId) {
      throw new ForbiddenException("You can only delete your own murmurs");
    }

    await this.murmurRepository.delete(murmurId);
  }

  async getTimeline(
    userId: number,
    { page = 1, limit = 10 }: IPaginationParams = {}
  ): Promise<IPaginatedResponse<IMurmurResponse[]>> {
    const skip = (page - 1) * limit;

    const followedUserIdsSubQuery = this.murmurRepository.manager
      .createQueryBuilder()
      .select("follow.followingId")
      .from("follows", "follow")
      .where("follow.followerId = :userId", { userId })
      .andWhere("follow.followingId != :userId", { userId })
      .getQuery();

    const [murmurs, total] = await this.murmurRepository
      .createQueryBuilder("murmur")
      .leftJoinAndSelect("murmur.user", "user")
      .leftJoinAndSelect("murmur.likes", "likes")
      .where(
        `murmur.userId IN (${followedUserIdsSubQuery}) OR murmur.userId = :userId`
      )
      .setParameters({ userId })
      .orderBy("murmur.createdAt", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

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
      isLiked: m.likes?.some((like) => like.userId === userId) || false,
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

  async getMurmursByUserId(
    targetUserId: number,
    viewerUserId?: number,
    { page = 1, limit = 10 }: IPaginationParams = {}
  ): Promise<IPaginatedResponse<IMurmurResponse[]>> {
    const skip = (page - 1) * limit;

    const [murmurs, total] = await this.murmurRepository.findAndCount({
      where: { userId: targetUserId },
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
      isLiked: viewerUserId
        ? m.likes?.some((like) => like.userId === viewerUserId) || false
        : false,
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

  async getMurmurById(
    murmurId: number,
    viewerUserId: number
  ): Promise<IMurmurResponse> {
    const murmur = await this.murmurRepository.findOne({
      where: { id: murmurId },
      relations: ["user", "likes"],
    });

    if (!murmur) {
      throw new NotFoundException("Murmur not found");
    }

    return {
      id: murmur.id,
      text: murmur.text,
      createdAt: murmur.createdAt,
      author: {
        id: murmur.user.id,
        username: murmur.user.username,
        name: murmur.user.name,
      },
      likesCount: murmur.likes?.length || 0,
      isLiked:
        murmur.likes?.some((like) => like.userId === viewerUserId) || false,
    };
  }
}
