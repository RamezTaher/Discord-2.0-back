import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  messageContent: string;

  @IsNotEmpty()
  @IsNumber()
  channelId: number;
}
