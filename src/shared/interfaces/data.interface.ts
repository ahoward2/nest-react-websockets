export interface User {
  userId: string;
  userName: string;
}

export interface Message {
  user: User;
  message: string;
}
