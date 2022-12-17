import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Room } from '../entities/room.entity';
import { RoomService } from './room.service';

@Controller()
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('api/rooms')
  async getAllRooms(): Promise<Room[]> {
    return await this.roomService.getRooms();
  }

  @Get('api/rooms/:room')
  async getRoom(@Param() params): Promise<Room> {
    const room = await this.roomService.getRoomByName(params.room);
    if (room === 'Not Exists') {
      throw new NotFoundException();
    }
    return room;
  }
}
