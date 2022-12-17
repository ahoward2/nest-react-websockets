import React from 'react';
import { Room, User } from '../../shared/interfaces/chat.interface';

export const UserList = ({
  room,
  currentUser,
  kickHandler,
}: {
  room: Room;
  currentUser: User;
  kickHandler: (user: User) => void;
}) => {
  return (
    <div className="flex h-4/6 w-full flex-col-reverse overflow-y-scroll">
      {room.users.map((user, index) => {
        return (
          <div
            key={index}
            className="mb-4 flex justify-between rounded px-4 py-2"
          >
            <div className="flex items-center">
              <p className="text-white">{user.userName}</p>
              {room.host.userId === user.userId && (
                <span className="ml-2">{'👑'}</span>
              )}
            </div>
            {room.host.userId === currentUser.userId &&
              user.userId !== currentUser.userId && (
                <button
                  className="flex h-8 items-center justify-self-end rounded-xl bg-gray-800 px-4"
                  onClick={() => kickHandler(user)}
                >
                  <span className="mr-1 text-white">{'Kick'}</span>
                </button>
              )}
          </div>
        );
      })}
    </div>
  );
};
