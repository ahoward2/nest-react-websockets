import React, { useRef } from 'react';
import { Message } from '../../shared/interfaces/chat.interface';
import { MessageSchema } from '../../shared/schemas/chat.schema';

export const MessageForm = ({
  sendMessage,
}: {
  sendMessage: (message: Message['message']) => void;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const submit = (e) => {
    e.preventDefault();
    const value = textAreaRef?.current?.value;
    if (value) {
      sendMessage(value);
      textAreaRef.current.value = '';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submit(e);
    }
  };

  return (
    <div className="flex h-1/6 items-center">
      <form className="flex w-full appearance-none rounded-md bg-gray-800 outline-none focus:outline-none">
        <textarea
          ref={textAreaRef}
          onKeyDown={(e) => handleKeyDown(e)}
          id="minput"
          placeholder="Message"
          maxLength={MessageSchema?.maxLength ?? undefined}
          className="mb-2 max-h-16 flex-grow appearance-none rounded-md border-none bg-gray-800 text-white placeholder-slate-400 focus:outline-none focus:ring-transparent"
        ></textarea>
        <button
          onClick={(e) => submit(e)}
          className="self-end p-2 text-slate-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4 bg-gray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};
