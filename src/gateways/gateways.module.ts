import { Module } from '@nestjs/common';
import { MessagingGateway } from './gateways';
import { Services } from 'src/utils/constants';
import { GatewaysSessionManager } from './gateways.session';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [ChannelsModule],
  providers: [
    MessagingGateway,
    {
      provide: Services.GATEWAYS_SESSION_MANAGER,
      useClass: GatewaysSessionManager,
    },
  ],
})
export class GatewaysModule {}
