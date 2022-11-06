import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io();

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('events', (e) => {
      setMessages((messages) => [e, ...messages]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('events');
    };
  }, []);

  const sendPing = (e) => {
    console.log(e);
    socket.emit('events', e.target[0].value);
  };

  return (
    <div>
      <p>Connected: {'' + isConnected}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendPing(e);
        }}
      >
        <textarea id="minput"></textarea>
        <input type="submit" value="submit"></input>
      </form>
      {messages?.map((message, index) => {
        return <p key={index}>{message}</p>;
      })}
    </div>
  );
}

export default App;
