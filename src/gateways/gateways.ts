import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Services } from 'src/utils/constants';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { Message } from 'src/utils/typeorm';
import { IGatewaySessionManager } from './gateways.interfaces';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class MessagingGateway implements OnGatewayConnection {
  constructor(
    @Inject(Services.GATEWAYS_SESSION_MANAGER)
    private readonly gatewaysSessionManager: IGatewaySessionManager,
  ) {}
  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('New Incoming Connection');
    console.log(socket.user);
    this.gatewaysSessionManager.setUserSocket(socket.user.id, socket);
    socket.emit('connected', { status: 'good' });
  }

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    console.log('Create Message');
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(message: Message) {
    console.log('Inside message.create');
    console.log(message);
    const senderSocket = this.gatewaysSessionManager.getUserSocket(
      message.sender.id,
    );
    const receiverSocket =
      message.sender === message.channel.sender
        ? this.gatewaysSessionManager.getUserSocket(message.channel.receiver.id)
        : this.gatewaysSessionManager.getUserSocket(message.channel.sender.id);
    if (senderSocket) {
      senderSocket.emit('onMessage', message);
    }
    if (receiverSocket) {
      receiverSocket.emit('onMessage', message);
    }
  }
}
