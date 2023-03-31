import { Module } from '@nestjs/common';
import { MessagingGateway } from './gateways';

@Module({
  providers: [MessagingGateway],
})
export class GatewaysModule {}
