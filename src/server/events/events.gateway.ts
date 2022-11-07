import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Message } from '../../shared/interfaces/data.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer() server;
  private logger = new Logger('EventsGateway');

  @SubscribeMessage('events')
  async handleEvent(
    @MessageBody()
    payload: Message,
    @ConnectedSocket() client: Socket, // can send messages directly to specific client
  ): Promise<Message> {
    this.logger.log(payload);
    this.server.emit('events', payload); // broadcast messages
    return payload;
  }
}
