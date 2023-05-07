import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @IsString()
  message: string;
}
