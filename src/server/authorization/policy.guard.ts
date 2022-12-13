import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  Action,
  AppAbility,
  CaslAbilityFactory,
} from '../casl/casl-ability.factory';
import { Room } from '../entities/room.entity';
import { User } from '../entities/user.entity';
import { PolicyHandler } from './interfaces/policy.interface';
import { CHECK_POLICIES_KEY } from './policy.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { req } = context.switchToHttp().getResponse();
    const user = new User({ ...JSON.parse(req.get('user')) });
    console.log('User from policies guard: ', user);
    const ability = this.caslAbilityFactory.defineAbilityFor(user);

    const room = new Room({ name: 'newroom', host: user, users: [user] });
    console.log(ability.can(Action.Read, room));

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
