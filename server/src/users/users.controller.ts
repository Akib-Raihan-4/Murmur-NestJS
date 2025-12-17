import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import {
  IApiResponse,
  successResponse,
} from "src/common/interfaces/api-response.interface";
import { User } from "src/entities/user.entity";
import { IProfileData } from "./users.intefaces";
import { UsersService } from "./users.service";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get("me")
  async getMyProfile(
    @CurrentUser() user: User
  ): Promise<IApiResponse<IProfileData>> {
    const profile = await this.usersService.getUserProfile(user.id);

    return successResponse(profile, "Profile fetched successfully");
  }

  @Get(":id")
  async getUserProfile(
    @Param("id", ParseIntPipe) userId: number
  ): Promise<IApiResponse<IProfileData>> {
    const profile = await this.usersService.getUserProfile(userId);

    return successResponse(profile, "User profile fetched successfully");
  }
}
