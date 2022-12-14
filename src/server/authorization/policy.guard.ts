import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  Action,
  AppAbility,
  CaslAbilityFactory,
} from '../casl/casl-ability.factory';
import { UserService } from '../user/user.service';
import { PolicyHandler } from './interfaces/policy.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers: PolicyHandler[] = [];

    // CHECK HTTP CONTEXTS ========================================

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const rawUser = request.get('user');
    const params = request.params;

    if (!rawUser) {
      return false;
    }

    const user = JSON.parse(rawUser);
    const { room: roomName } = params;

    console.log('User from policies guard: ', user);
    const ability = this.caslAbilityFactory.createForUser(user);

    if (roomName) {
      const rooms = await this.userService.getRooms();
      const roomIndex = await this.userService.getRoomByName(roomName);
      policyHandlers.push((ability) =>
        ability.can(Action.Read, rooms[roomIndex]),
      );
    }

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
