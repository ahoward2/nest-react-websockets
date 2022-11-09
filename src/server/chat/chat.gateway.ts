import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  ClientToServerEvents,
  Message,
} from '../../shared/interfaces/chat.interface';
import { Server } from 'socket.io';
import { ServerToClientEvents } from '../../shared/interfaces/chat.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();
  private logger = new Logger('ChatGateway');

  @SubscribeMessage('chat')
  async handleEvent(
    @MessageBody()
    payload: Message,
    @ConnectedSocket() client: Socket, // can send messages directly to specific client
  ): Promise<Message> {
    this.logger.log(payload);
    this.server.emit('chat', payload); // broadcast messages
    return payload;
  }
}
