import React from 'react';
import { Room } from '../../shared/interfaces/chat.interface';

export const UserList = ({ room }: { room: Room }) => {
  return (
    <div className="flex h-4/6 w-full flex-col-reverse overflow-y-scroll">
      {room.users.map((user, index) => {
        return (
          <div key={index} className="mb-4 flex rounded px-4 py-2">
            <p className="text-white">{user.userName}</p>
            {room.host.userId === user.userId && (
              <span className="ml-2">{'👑'}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
