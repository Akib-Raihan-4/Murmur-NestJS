import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/entities/user.entity";
import { FollowService } from "./follow.service";
import {
  IApiResponse,
  successResponse,
} from "src/common/interfaces/api-response.interface";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { IFollowData } from "./follow.intefaces";

@UseGuards(JwtAuthGuard)
@Controller("follow")
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post(":id")
  async followUser(
    @CurrentUser() currentUser: User,
    @Param("id", ParseIntPipe) followingId: number
  ): Promise<IApiResponse<IFollowData>> {
    const data = await this.followService.follow(currentUser.id, followingId);

    return successResponse(data, "You are now following this user");
  }

  @Delete(":id")
  async unfollowUser(
    @CurrentUser() currentUser: User,
    @Param("id", ParseIntPipe) followingId: number
  ): Promise<IApiResponse<IFollowData>> {
    const data = await this.followService.unfollow(currentUser.id, followingId);

    return successResponse(data, "You have unfollowed this user");
  }
}
