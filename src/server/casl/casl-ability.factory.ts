import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Room } from '../entities/room.entity';
import { User } from '../entities/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof Room | typeof User> | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;
type FlatRoom = Room & {
  'host.userId': Room['host']['userId'];
};

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    // All users can read all rooms
    can(Action.Read, Room);

    // Host can manage room
    can<FlatRoom>(Action.Manage, Room, {
      'host.userId': user.userId,
    });

    return build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
