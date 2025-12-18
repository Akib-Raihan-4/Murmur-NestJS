import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Follow } from "src/entities/follow.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { IFollowData } from "./follow.intefaces";

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async follow(followerId: number, followingId: number): Promise<IFollowData> {
    if (followerId === followingId) {
      throw new BadRequestException("You cannot follow yourself");
    }

    const followingUser = await this.userRepository.findOne({
      where: { id: followingId },
    });
    if (!followingUser) {
      throw new NotFoundException("User to follow not found");
    }

    const existing = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (existing) {
      throw new BadRequestException("You are already following this user");
    }

    const follow = this.followRepository.create({
      followerId,
      followingId,
    });

    await this.followRepository.save(follow);

    return { followingId: followingUser.id };
  }

  async unfollow(
    followerId: number,
    followingId: number
  ): Promise<IFollowData> {
    if (followerId === followingId) {
      throw new BadRequestException("You cannot unfollow yourself");
    }

    const result = await this.followRepository.delete({
      followerId,
      followingId,
    });

    if (result.affected === 0) {
      throw new NotFoundException("You are not following this user");
    }

    return { followingId };
  }
}
