import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
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

@UseGuards(JwtAuthGuard)
@Controller("murmur")
export class MurmurController {
  constructor(private murmurService: MurmurService) {}
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
}
