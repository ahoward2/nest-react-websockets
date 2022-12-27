import React from 'react';

export const Loading = ({ message }: { message?: string }) => {
  return (
    <div className="flex w-full items-center justify-center py-2">
      {message ? (
        <p className="text-xl font-semibold text-white">{message}</p>
      ) : null}
      <div className="flex w-full items-center justify-center">
        <div className="flex h-10 w-10 animate-spin items-center justify-center rounded-full bg-gradient-to-tr from-slate-500 to-slate-800">
          <div className="h-6 w-6 rounded-full bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
};
