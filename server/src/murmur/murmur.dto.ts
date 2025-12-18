import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class CreateMurmurDto {
  @IsNotEmpty({ message: "Text cannot be empty" })
  @IsString()
  @MaxLength(280, { message: "Murmur cannot exceed 280 characters" })
  text: string;
}
