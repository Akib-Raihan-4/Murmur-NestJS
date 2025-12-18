import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "src/entities/user.entity";
import { IProfileData } from "./users.intefaces";
import {
  IPaginatedResponse,
  IPaginationParams,
} from "src/common/interfaces/pagination.interface";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(
    username: string,
    password: string,
    name: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      name,
      passwordHash: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async getUserProfile(
    viewedUserId: number,
    viewerUserId?: number
  ): Promise<IProfileData> {
    const user = await this.usersRepository.findOne({
      where: { id: viewedUserId },
      relations: ["followers", "following"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isFollowing = viewerUserId
      ? user.followers?.some((follow) => follow.followerId === viewerUserId) ||
        false
      : false;

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      isFollowing,
    };
  }

  async getAllUsers(
    currentUserId: number,
    { page = 1, limit = 10 }: IPaginationParams = {}
  ): Promise<IPaginatedResponse<IProfileData[]>> {
    const skip = (page - 1) * limit;

    const [users, total] = await this.usersRepository.findAndCount({
      where: { id: Not(currentUserId) },
      relations: ["followers", "following"],
      order: { username: "ASC" },
      skip,
      take: limit,
    });

    const data: IProfileData[] = users.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      isFollowing:
        user.followers?.some((f) => f.followerId === currentUserId) || false,
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
