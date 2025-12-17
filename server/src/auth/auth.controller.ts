import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { IApiResponse } from "src/common/interfaces/api-response.interface";
import { SignInDto, SignupDto } from "./auth.dto";
import { ISignupResponseData } from "./auth.interfaces";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() signupDto: SignupDto
  ): Promise<IApiResponse<ISignupResponseData>> {
    return this.authService.signUp(
      signupDto.username,
      signupDto.password,
      signupDto.name
    );
  }

  @Post("signin")
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signinDto: SignInDto
  ): Promise<IApiResponse<ISignupResponseData>> {
    return this.authService.signIn(signinDto.username, signinDto.password);
  }
}
