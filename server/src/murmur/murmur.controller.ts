import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/entities/user.entity";
import { CreateMurmurDto } from "./murmur.dto";
import { MurmurService } from "./murmur.service";
import { successResponse } from "src/common/interfaces/api-response.interface";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { LikeService } from "src/like/like.service";

@UseGuards(JwtAuthGuard)
@Controller("murmur")
export class MurmurController {
  constructor(
    private murmurService: MurmurService,
    private likeService: LikeService
  ) {}
  @Post()
  async create(
    @CurrentUser() currentUser: User,
    @Body() createMurmurDto: CreateMurmurDto
  ) {
    const murmur = await this.murmurService.create(
      currentUser.id,
      createMurmurDto.text
    );

    return successResponse(murmur, "Murmur posted successfully");
  }

  @Get()
  async getMyMurmurs(
    @CurrentUser() currentUser: User,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ) {
    const paginated = await this.murmurService.getMyMurmurs(currentUser.id, {
      page,
      limit,
    });

    return successResponse(
      paginated.data,
      "Your murmurs fetched successfully",
      paginated.pagination
    );
  }

  @Delete(":id")
  async deleteMurmur(
    @CurrentUser() currentUser: User,
    @Param("id", ParseIntPipe) murmurId: number
  ) {
    await this.murmurService.delete(murmurId, currentUser.id);

    return successResponse(null, "Murmur deleted successfully");
  }

  @Get("timeline")
  async getTimeline(
    @CurrentUser() currentUser: User,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ) {
    const paginated = await this.murmurService.getTimeline(currentUser.id, {
      page,
      limit,
    });

    return successResponse(
      paginated.data,
      "Timeline fetched successfully",
      paginated.pagination
    );
  }

  @Post(":id/toggle-like")
  async toggleLike(
    @CurrentUser() currentUser: User,
    @Param("id", ParseIntPipe) murmurId: number
  ) {
    const result = await this.likeService.toggleLike(currentUser.id, murmurId);

    return successResponse(
      result,
      result.isLiked ? "Murmur liked" : "Murmur unliked"
    );
  }
  @Get(":id")
  async getMurmur(
    @CurrentUser() currentUser: User,
    @Param("id", ParseIntPipe) murmurId: number
  ) {
    const murmur = await this.murmurService.getMurmurById(
      murmurId,
      currentUser.id
    );

    return successResponse(murmur, "Murmur fetched successfully");
  }
}
