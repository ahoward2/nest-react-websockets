import React from 'react';

export const LoginForm = ({
  login,
  disableNewRoom,
  defaultUser,
}: {
  login: (e: React.FormEvent<HTMLFormElement>) => void;
  disableNewRoom: boolean;
  defaultUser?: string;
}) => {
  return (
    <div className="h-full w-full py-2 md:px-2 md:py-0">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(e);
        }}
        className="flex flex-col justify-center"
      >
        <input
          type="text"
          id="login"
          placeholder="Name"
          defaultValue={defaultUser && defaultUser}
          required={true}
          className="mb-2 h-12 rounded-md border border-slate-400 bg-gray-800 text-white placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        ></input>
        <input
          type="text"
          id="room"
          disabled={disableNewRoom}
          placeholder="New room"
          className="mb-2 h-12 rounded-md border border-slate-400 bg-gray-800 text-white placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50"
        ></input>
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center rounded-md bg-violet-700 text-white"
        >
          Join
        </button>
      </form>
    </div>
  );
};
