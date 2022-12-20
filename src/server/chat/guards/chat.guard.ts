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
import {
  EventName,
  Room as RoomType,
  User,
} from '../../../shared/interfaces/chat.interface';
import { Room } from '../../entities/room.entity';

@Injectable()
export class ChatPoliciesGuard<
  CtxData extends {
    user: User;
    roomName: RoomType['name'];
    eventName: EventName;
  },
> implements CanActivate
{
  constructor(
    private caslAbilityFactory: CaslAbilityFactory,
    private roomService: RoomService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers: PolicyHandler[] = [];
    const ctx = context.switchToWs();
    const data = ctx.getData<CtxData>();
    const user = data.user;

    if (data.eventName === 'kick_room') {
      const room = await this.roomService.getRoomByName(data.roomName);
      if (room === 'Not Exists') {
        throw 'Room does not exist';
      }
      policyHandlers.push((ability) => ability.can(Action.Kick, room));
    }

    if (data.eventName === 'join_room') {
      policyHandlers.push((ability) => ability.can(Action.Join, Room));
    }
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
