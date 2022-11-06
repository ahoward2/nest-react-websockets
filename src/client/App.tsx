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

  const sendPing = () => {
    socket.emit('events', 'Hello world');
  };

  return (
    <div>
      <p>Connected: {'' + isConnected}</p>
      <button onClick={sendPing}>Send ping</button>
      {messages?.map((message) => {
        return <p>{message}</p>;
      })}
    </div>
  );
}

export default App;
