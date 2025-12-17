// src/auth/auth.service.ts
import { Injectable, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { User } from "src/entities/user.entity";
import { ISignupResponseData } from "./auth.interfaces";
import {
  IApiResponse,
  successResponse,
} from "src/common/interfaces/api-response.interface";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signUp(
    username: string,
    password: string,
    name: string
  ): Promise<IApiResponse<ISignupResponseData>> {
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new ConflictException("Username already exists");
    }

    const user = await this.usersService.create(username, password, name);

    const tokenData = this.generateToken(user);

    return successResponse(tokenData, "User registered successfully");
  }

  private generateToken(user: User): ISignupResponseData {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    };
  }
}
