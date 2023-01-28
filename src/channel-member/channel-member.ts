import {
  CreateChannelMemeberParams,
  FindChannelMemberParams,
} from 'src/utils/@types';
import { ChannelMember } from 'src/utils/typeorm';

export interface IChannelMemberService {
  findChannelMemeber(
    params: FindChannelMemberParams,
  ): Promise<ChannelMember | null>;
  createChannelMemeber(
    params: CreateChannelMemeberParams,
  ): Promise<ChannelMember>;
  findChannelMemebersChannels(id: number);
}
