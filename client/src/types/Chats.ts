import { User } from './User';

export type Message = {
  id: number;
  sender: User;
  content: string;
  sendTime: Date;
};

export type Conversation = {
  id: number;
  name: string;
  creator: User;
  createdAt: Date;
  users: User[];
  messages: Message[];
};

export type Chat = {
  id: number;
  user1: User;
  user2: User;
  messages: Message[];
};
