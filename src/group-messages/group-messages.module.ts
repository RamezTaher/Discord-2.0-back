import { Module } from '@nestjs/common';
import { GroupMessagesService } from './group-messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, GroupMessage, User } from 'src/utils/typeorm';
import { GroupMessagesController } from './group-messages.controller';
import { Services } from 'src/utils/constants';
import { GroupsModule } from 'src/groups/groups.module';

@Module({
  imports: [GroupsModule, TypeOrmModule.forFeature([GroupMessage])],
  controllers: [GroupMessagesController],
  providers: [
    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessagesService,
    },
  ],
  exports: [
    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessagesService,
    },
  ],
})
export class GroupMessagesModule {}
