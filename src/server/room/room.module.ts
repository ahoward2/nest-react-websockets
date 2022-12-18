import { Module } from '@nestjs/common';
import { CaslModule } from '../casl/casl.module';
import { UserModule } from '../user/user.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [UserModule, CaslModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
