import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { Services } from 'src/utils/constants';
import { GroupsService } from './groups.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/utils/typeorm';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Group])],
  controllers: [GroupsController],
  providers: [
    {
      provide: Services.GROUPS,
      useClass: GroupsService,
    },
  ],
})
export class GroupsModule {}
