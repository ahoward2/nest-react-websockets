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
    <div className="h-full w-full">
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
          className="mb-2 mr-2 h-12 rounded-md border border-slate-400 bg-gray-800 text-white placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        ></input>
        <input
          type="text"
          id="room"
          disabled={disableNewRoom}
          placeholder="New room"
          className="mb-2 mr-2 h-12 rounded-md border border-slate-400 bg-gray-800 text-white placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50"
        ></input>
        <button
          type="submit"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-700 text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};
