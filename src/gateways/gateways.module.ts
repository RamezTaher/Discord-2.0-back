import { Module } from '@nestjs/common';
import { MessagingGateway } from './gateways';

@Module({
  providers: [
    MessagingGateway,
    {
      provide: Services.GATEWAYS_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
})
export class GatewaysModule {}
