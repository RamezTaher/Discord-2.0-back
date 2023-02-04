import { Module } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { MessagingGateway } from './gateways';
import { GatewaysSessionManager } from './gateways.session.manager';

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
