import { Module } from '@nestjs/common';
import { CaslModule } from '../casl/casl.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [CaslModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
