import { CreateChannelParams } from 'src/utils/@types';
import { Channel, User } from 'src/utils/typeorm';

export interface IChannelsService {
  createChannel(userDB: User, params: CreateChannelParams);

  createChannelMemberAndSaveUser(user: User, id: number);

  getChannel(id: number);
  getChannelById(id: number): Promise<Channel>;
  getChannelByChannelMembers(channelMembers: number[]): Promise<Channel>;
}
