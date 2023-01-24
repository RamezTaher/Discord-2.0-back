import { CreateChannelParams } from 'src/utils/@types';

export interface IChannelsService {
  createChannel(params: CreateChannelParams);
}
