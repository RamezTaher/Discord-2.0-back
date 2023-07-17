import { Module } from '@nestjs/common';
import { GroupMessagesService } from './group-messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMessage, Message } from 'src/utils/typeorm';
import { GroupMessagesController } from './group-messages.controller';
import { Services } from 'src/utils/constants';

@Module({
  imports: [GroupMessage, TypeOrmModule.forFeature([GroupMessage])],
  controllers: [GroupMessagesController],
  providers: [
    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessagesService,
    },
  ],
})
export class GroupMessagesModule {}
