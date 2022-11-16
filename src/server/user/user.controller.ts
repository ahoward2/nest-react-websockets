import { Controller, Get } from '@nestjs/common';
import { User } from '../../shared/interfaces/chat.interface';
import { UserService } from './user.service';

@Controller('api/current-users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(): Promise<Partial<User>[]> {
    return await this.userService.getUsers();
  }
}
