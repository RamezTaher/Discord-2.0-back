import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsNumber()
  receiverId: number;
  @IsNotEmpty()
  @IsString()
  message: string;
}
