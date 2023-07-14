import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Services } from '../utils/constants';
import { AuthenticatedSocket } from '../utils/interfaces';
import { Channel, Message } from '../utils/typeorm';
import { IGatewaySessionManager } from './gateways.session';
import { CreateMessageResponse } from 'src/utils/@types';
import { IChannelsService } from 'src/channels/channels';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class MessagingGateway implements OnGatewayConnection {
  constructor(
    @Inject(Services.GATEWAYS_SESSION_MANAGER)
    private readonly sessions: IGatewaySessionManager,
    @Inject(Services.CHANNELS)
    private readonly channelsService: IChannelsService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('New Incoming Connection');
    console.log(socket.user);
    this.sessions.setUserSocket(socket.user.id, socket);
    socket.emit('connected', { status: 'good' });
  }

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    console.log('Create Message');
  }

  @SubscribeMessage('onChannelJoin')
  onChannelJoin(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onChannelJoin');
    client.join(data.channelId);
    console.log(client.rooms);
    client.to(data.channelId).emit('userJoin');
  }

  @SubscribeMessage('onChannelLeave')
  onChannelLeave(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onChannelLeave');
    client.leave(data.channelId);
    console.log(client.rooms);
    client.to(data.channelId).emit('userLeave');
  }

  @SubscribeMessage('onTypingStart')
  onTypingStart(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.to(data.channelId).emit('onTypingStart');
  }

  @SubscribeMessage('onTypingStop')
  onTypingStop(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.to(data.channelId).emit('onTypingStop');
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: CreateMessageResponse) {
    console.log('Inside message.create');
    const {
      sender: author,
      channel: { sender: creator, receiver },
    } = payload.message;

    const senderSocket = this.sessions.getUserSocket(author.id);
    const receiverSocket =
      author.id === creator.id
        ? this.sessions.getUserSocket(receiver.id)
        : this.sessions.getUserSocket(creator.id);
    console.log(`Recipient Socket: ${JSON.stringify(receiverSocket?.user)}`);

    if (receiverSocket) {
      receiverSocket.emit('onMessage', payload);
    }
    if (senderSocket) {
      senderSocket.emit('onMessage', payload);
    }
  }

  @OnEvent('channel.create')
  handleConversationCreateEvent(payload: Channel) {
    console.log('Inside conversation.create');
    console.log(payload.receiver);
    const receiverSocket = this.sessions.getUserSocket(payload.receiver.id);
    if (receiverSocket) receiverSocket.emit('onConversation', payload);
  }

  @OnEvent('message.delete')
  async handleMessageDelete(payload: any) {
    console.log('Inside message.delete');
    console.log(payload);
    const channel = await this.channelsService.getChannelById(
      payload.channelId,
    );
    if (!channel) return;
    const { sender, receiver } = channel;
    const senderSocket = this.sessions.getUserSocket(payload.userId);
    const receiverSocket =
      sender.id === payload.userId
        ? this.sessions.getUserSocket(receiver.id)
        : this.sessions.getUserSocket(sender.id);
    if (senderSocket) senderSocket.emit('onMessageDelete', payload);
    if (receiverSocket) receiverSocket.emit('onMessageDelete', payload);
  }

  @OnEvent('message.update')
  async handleMessageUpdate(message: Message) {
    const {
      sender,
      channel: { sender: creator, receiver },
    } = message;
    console.log(message);
    const recipientSocket =
      sender.id === creator.id
        ? this.sessions.getUserSocket(receiver.id)
        : this.sessions.getUserSocket(creator.id);
    if (recipientSocket) recipientSocket.emit('onMessageUpdate', message);
  }
}
