import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.tsx';
import './index.css';
// import { User } from './types/User.ts';
// import { Chat } from './types/Chats.ts';
// import { ContactType } from './types/User.ts';
// import { Message } from './types/Chats.ts';

// let u: User | null = null;
// let c: Chat[] = [];
// let con: ContactType[] = [];
// let m: Message[] = [];

// u = null;
// c = [];
// con = [];
// m = [];

// const updateUser = (u_: User | null) => {
//   u = u_;
// };
// const updateMessages = (m_: Message[]) => {
//   m = m_;
// };
// const updateChat = (c_: Chat[]) => {
//   c = c_;
// };
// const updateContacts = (c: ContactType[]) => {
//   con = c;
// };

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
    // user={u}
    // chats={c}
    // contacts={con}
    // message={m}
    // setChats={updateChat}
    // setMessages={updateMessages}
    // setUser={updateUser}
    // setContacts={updateContacts}
    />
  </React.StrictMode>,
);
