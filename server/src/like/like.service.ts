import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like } from "src/entities/like.entitiy";
import { Murmur } from "src/entities/murmur.entity";
import { Repository } from "typeorm";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Murmur)
    private murmurRepository: Repository<Murmur>
  ) {}

  async toggleLike(
    userId: number,
    murmurId: number
  ): Promise<{ likesCount: number; isLiked: boolean }> {
    const murmurExists = await this.murmurRepository.findOne({
      where: { id: murmurId },
      select: ["id"],
    });

    if (!murmurExists) {
      throw new NotFoundException("Murmur not found");
    }

    const existingLike = await this.likeRepository.findOne({
      where: { userId, murmurId },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      const newCount = await this.likeRepository.count({ where: { murmurId } });
      return { likesCount: newCount, isLiked: false };
    } else {
      const like = this.likeRepository.create({ userId, murmurId });
      await this.likeRepository.save(like);
      const newCount = await this.likeRepository.count({ where: { murmurId } });
      return { likesCount: newCount, isLiked: true };
    }
  }
}
