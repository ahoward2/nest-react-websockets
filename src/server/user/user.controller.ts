import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Action } from '../casl/casl-ability.factory';
import { CheckPolicies } from '../authorization/policy.decorator';
import { PoliciesGuard } from '../authorization/policy.guard';
import { AppAbility } from '../casl/casl-ability.factory';
import { Room } from '../entities/room.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/rooms')
  async getAllRooms(): Promise<Room[]> {
    return await this.userService.getRooms();
  }

  @Get('api/rooms/:room')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Room))
  async getRoom(@Param() params): Promise<Room> {
    const rooms = await this.userService.getRooms();
    const room = await this.userService.getRoomByName(params.room);
    return rooms[room];
  }
}
