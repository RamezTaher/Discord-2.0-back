import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  senderUserName: string;

  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  receiverUserName: string;
  @IsNotEmpty()
  @IsString()
  message: string;
}
