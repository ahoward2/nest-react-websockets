import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [RoomModule, UserModule, CaslModule],
  providers: [ChatGateway],
})
export class ChatModule {}
