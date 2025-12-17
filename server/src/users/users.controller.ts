import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
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
    const profile = await this.usersService.getUserProfile(user.id, user.id);

    return successResponse(profile, "Profile fetched successfully");
  }

  @Get(":id")
  async getUserProfile(
    @CurrentUser() currentUser: User,
    @Param("id", ParseIntPipe) userId: number
  ): Promise<IApiResponse<IProfileData>> {
    const profile = await this.usersService.getUserProfile(
      userId,
      currentUser.id
    );

    return successResponse(profile, "User profile fetched successfully");
  }

  @Get()
  async getAllUsers(
    @CurrentUser() currentUser: User,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ): Promise<IApiResponse<IProfileData[]>> {
    const result = await this.usersService.getAllUsers(currentUser.id, {
      page,
      limit,
    });

    return successResponse(
      result.data,
      "Users fetched successfully",
      result.pagination
    );
  }
}
