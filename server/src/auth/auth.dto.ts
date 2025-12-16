import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
