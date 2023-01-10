import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @MaxLength(32)
  firstName: string;
  @IsNotEmpty()
  @MaxLength(32)
  lastName: string;
  @IsNotEmpty()
  @MaxLength(32)
  userName: string;
  @IsNotEmpty()
  @MaxLength(32)
  password: string;
}
