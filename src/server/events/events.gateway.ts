import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

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
    payload: { userId: string; userName: string; message: string },
    @ConnectedSocket() client: Socket, // can send messages directly to specific client
  ): Promise<{ userId: string; userName: string; message: string }> {
    this.logger.log(payload);
    this.server.emit('events', payload); // broadcast messages
    return payload;
  }
}
