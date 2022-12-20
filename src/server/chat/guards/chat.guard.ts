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
  ClientToServerEvents,
  Room as RoomType,
  User,
} from '../../../shared/interfaces/chat.interface';
import { Room } from '../../entities/room.entity';

@Injectable()
export class ChatPoliciesGuard<
  CtxData extends {
    user: User;
    roomName: RoomType['name'];
    eventName: keyof ClientToServerEvents;
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
    const room = await this.roomService.getRoomByName(data.roomName);

    if (data.eventName === 'kick_user') {
      if (room === 'Not Exists') {
        throw `Room must exist to evaluate ${data.eventName} policy`;
      }
      policyHandlers.push((ability) => ability.can(Action.Kick, room));
    }

    if (data.eventName === 'join_room') {
      policyHandlers.push((ability) => ability.can(Action.Join, Room));
    }

    if (data.eventName === 'chat') {
      if (room === 'Not Exists') {
        throw `Room must exist to evaluate ${data.eventName} policy`;
      }
      policyHandlers.push((ability) => ability.can(Action.Message, room));
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
