import React, { useEffect, useState } from 'react';
import { Room } from '../../shared/interfaces/chat.interface';
import { Loading } from './loading';

export const Rooms = ({
  rooms,
  selectionHandler,
  selectedRoom,
  isLoading,
}: {
  rooms: Room[];
  selectionHandler: (roomName: Room['name']) => void;
  selectedRoom?: Room['name'];
  isLoading: boolean;
}) => {
  const [isDelay, setIsDelay] = useState<boolean>(true);
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setIsDelay(false);
    }, 1000);
    return () => {
      clearTimeout(delayTimer);
    };
  }, []);

  return (
    <div className="h-full w-full rounded-lg border border-slate-400 bg-gray-800 md:h-1/2">
      <div className="flex justify-between rounded-t-md border border-slate-400 bg-slate-400 p-2">
        <span>Join existing rooms</span>
        {selectedRoom && (
          <button onClick={() => selectionHandler('')}>Clear</button>
        )}
      </div>
      <div className="w-full">
        {!isLoading &&
          !isDelay &&
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
        {(isLoading || isDelay) && <Loading />}
      </div>
    </div>
  );
};
