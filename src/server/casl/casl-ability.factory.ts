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
  Kick = 'kick',
  Join = 'join',
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

    // Host can kick users from room
    can<FlatRoom>(Action.Kick, Room, {
      'host.userId': user.userId,
    });

    // Any user can join any room
    can(Action.Join, Room);

    return build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
