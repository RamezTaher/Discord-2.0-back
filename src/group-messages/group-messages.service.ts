import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMessage, Message } from '../utils/typeorm';
import { IGroupMessageService } from './group-messages';
import { CreateGroupMessageParams } from 'src/utils/@types';
import { Services } from 'src/utils/constants';
import { IGroupService } from 'src/groups/groups';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class GroupMessagesService implements IGroupMessageService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @Inject(Services.GROUPS)
    private readonly groupsService: IGroupService,
  ) {}

  async createGroupMessage({
    groupId: id,
    ...params
  }: CreateGroupMessageParams) {
    const { messageContent, sender } = params;
    const group = await this.groupsService.findGroupById(id);
    if (!group)
      throw new HttpException('No Group Found', HttpStatus.BAD_REQUEST);
    const findUser = group.users.find((u) => u.id === sender.id);
    if (!findUser)
      throw new HttpException('User not in group', HttpStatus.BAD_REQUEST);
    const groupMessage = this.groupMessageRepository.create({
      messageContent,
      group,
      sender: instanceToPlain(sender),
    });
    const savedMessage = await this.groupMessageRepository.save(groupMessage);
    group.lastMessageSent = savedMessage;
    return this.groupsService.saveGroup(group);
  }
}
