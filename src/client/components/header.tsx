import React from 'react';
import { Room, User } from '../../shared/interfaces/chat.interface';

export const Header = ({
  isConnected,
  users,
  handleUsersClick,
  handleLeaveRoom,
  roomName,
}: {
  isConnected: boolean;
  users: User[];
  handleUsersClick: () => void;
  handleLeaveRoom: () => void;
  roomName: Room['name'];
}) => {
  return (
    <header className="flex h-1/6 flex-col pt-12">
      <div className="flex justify-between">
        <div className="flex h-8 items-center">
          <span className="ml-1">{isConnected ? '🟢' : '🔴'}</span>
          <span className="px-2 text-3xl text-white">{'/'}</span>
          <span className=" text-white">{roomName}</span>
        </div>
        <div className="flex">
          <button
            onClick={() => handleUsersClick()}
            className="ml-1 flex h-8 items-center rounded-xl bg-gray-800 px-4"
          >
            <span className="mr-1 text-lg text-white">{'👨‍💻'}</span>
            <span className="ml-1 text-white">{users.length}</span>
          </button>
          <button
            onClick={() => handleLeaveRoom()}
            className="ml-1 flex h-8 items-center rounded-xl bg-gray-800 px-4"
          >
            <span className="mr-1 text-white">{'Leave'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
