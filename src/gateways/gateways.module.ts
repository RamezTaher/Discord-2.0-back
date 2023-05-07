import { Module } from '@nestjs/common';
import { MessagingGateway } from './gateways';
import { Services } from 'src/utils/constants';
import { GatewaysSessionManager } from './gateways.session';

@Module({
  providers: [
    MessagingGateway,
    {
      provide: Services.GATEWAYS_SESSION_MANAGER,
      useClass: GatewaysSessionManager,
    },
  ],
})
export class GatewaysModule {}
