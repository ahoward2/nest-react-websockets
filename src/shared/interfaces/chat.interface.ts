export interface User {
  userId: string;
  userName: string;
  socketId?: string;
}

export interface Message {
  user: User;
  timeSent: string;
  message: string;
}

export interface ServerToClientEvents {
  chat: (e: Message) => void;
}

export interface ClientToServerEvents {
  chat: (e: Message) => void;
  set_client_data: (e: User) => void;
}
