import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  Action,
  AppAbility,
  CaslAbilityFactory,
} from '../../casl/casl-ability.factory';
import { RoomService } from '../../room/room.service';
import { PolicyHandler } from '../../casl/interfaces/policy.interface';
import { Socket } from 'socket.io';
import { UserService } from '../../user/user.service';
import { KickUser } from '../../../shared/interfaces/chat.interface';
import { KickUserSchema } from '../../../shared/schemas/chat.schema';

@Injectable()
export class ChatPoliciesGuard implements CanActivate {
  constructor(
    private caslAbilityFactory: CaslAbilityFactory,
    private roomService: RoomService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers: PolicyHandler[] = [];
    const ctx = context.switchToWs();
    const client = ctx.getClient<Socket>();
    const data = ctx.getData<KickUser>();
    // Since we're extracting data from context, we should validate it's
    // expected form. We do this with pipes which execute after the guard,
    // but given our guard has specific room targets, we need to interact
    // with our services so we should make sure data is correct before
    // doing so.
    KickUserSchema.parse(data);
    const userFromRooms = await this.roomService.getFirstInstanceOfUser(
      client.id,
    );
    const user = await this.userService.findUserById(userFromRooms.userId);
    if (user === 'Not Exists') {
      throw 'User does not exist';
    }
    const room = await this.roomService.getRoomByName(data.roomName);
    if (room === 'Not Exists') {
      throw 'Room does not exist';
    }
    policyHandlers.push((ability) => ability.can(Action.Manage, room));
    const ability = this.caslAbilityFactory.createForUser(user);
    policyHandlers.every((handler) => {
      const check = this.execPolicyHandler(handler, ability);
      if (check === false) {
        throw new ForbiddenException();
      }
    });
    return true;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
