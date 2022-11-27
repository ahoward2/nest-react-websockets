import React from 'react';
import { Room } from '../../shared/interfaces/chat.interface';

export const Rooms = ({
  rooms,
  selectionHandler,
  selectedRoom,
}: {
  rooms: Room[];
  selectionHandler: (roomName: string) => void;
  selectedRoom?: string;
}) => {
  return (
    <div className="my-auto h-full w-full rounded-lg border border-slate-400 bg-gray-800">
      <div className="flex justify-between rounded-t-md border border-slate-400 bg-slate-400 p-2">
        <span>Join existing rooms</span>
        {selectedRoom && (
          <button onClick={() => selectionHandler('')}>Clear</button>
        )}
      </div>
      <div className="w-full">
        {rooms &&
          rooms.map((room, index) => (
            <button
              key={index}
              className={
                selectedRoom === room.name
                  ? 'w-full bg-slate-900 p-2 text-left text-gray-400'
                  : ' w-full p-2 text-left text-gray-400'
              }
              onClick={() => selectionHandler(room.name)}
            >
              {room.name}
            </button>
          ))}
      </div>
    </div>
  );
};
