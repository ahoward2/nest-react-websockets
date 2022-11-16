import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [ChatGateway],
})
export class ChatModule {}
