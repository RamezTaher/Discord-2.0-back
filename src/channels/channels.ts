import { CreateChannelParams } from 'src/utils/@types';
import { User } from 'src/utils/typeorm';

export interface IChannelsService {
  createChannel(userDB: User, params: CreateChannelParams);
}
