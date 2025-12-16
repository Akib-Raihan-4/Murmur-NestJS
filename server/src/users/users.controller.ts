import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { IApiResponse, successResponse } from "src/common/interfaces/api-response.interface";
import { User } from "src/entities/user.entity";
import { IProfileData } from "./users.intefaces";

@Controller("users")
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get("me")
  getProfile(@CurrentUser() user: User): IApiResponse<IProfileData> {
    const profileData: IProfileData = {
      id: user.id,
      username: user.username,
      name: user.name,
    };

    return successResponse(profileData, "Profile fetched successfully");
  }
}
