import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'http';
import { CreateMessageResponse } from 'src/utils/@types';
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
export class MessagingGateway implements OnGatewayInit, OnGatewayConnection {
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
    console.log(data);
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: Message) {
    console.log('Inside message.create');
    const {
      sender,
      channel: { sender: channelSender, receiver: channelReceiver },
    } = payload;

    const senderSocket = this.gatewaysSessionManager.getUserSocket(sender.id);
    const receiverSocket =
      sender.id === channelSender.id
        ? this.gatewaysSessionManager.getUserSocket(channelReceiver.id)
        : this.gatewaysSessionManager.getUserSocket(channelSender.id);
    if (senderSocket) {
      senderSocket.emit('onMessage', payload);
    }
    if (receiverSocket) {
      receiverSocket.emit('onMessage', payload);
    }
  }

  afterInit(server: any) {
    console.log('WebSocket server initialized');
  }
}
