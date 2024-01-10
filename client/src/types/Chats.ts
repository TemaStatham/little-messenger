import { User } from './User';

export type Message = {
  id: number;
  userID: string;
  username: string;
  userPhoto: string;
  content: string;
  sendTime: Date;
};

export type PubChat = {
  id: number;
  name: string;
  photo: string;
  messages: Message[];

  creator: number;
  createdAt: Date;
  users: User[];
};

export type PrivChat = {
  id: number;
  userName: string;
  photo: string;
  messages: Message[];

  userID: number;
};

export type Chat = {
  chatID: number;
  name: string;
  photo: string;
  messages: Message[];
  type: string;

  userID: number; // можно использовать для 2-х целей

  users: User[];
};
