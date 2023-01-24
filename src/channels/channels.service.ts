import { Injectable } from '@nestjs/common';
import { IChannelsService } from './channels';

@Injectable()
export class ChannelsService implements IChannelsService {
  createChannel() {}
}
