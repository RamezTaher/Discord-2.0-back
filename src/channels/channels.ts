import { CreateChannelParams } from 'src/utils/@types';
import { Channel, User } from 'src/utils/typeorm';

export interface IChannelsService {
  createChannel(userDB: User, params: CreateChannelParams);
  getChannels(id: number): Promise<Channel[]>;
  getChannelById(id: number): Promise<Channel>;
}
