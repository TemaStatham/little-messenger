import styles from './ChatApp.module.css';
import { SideBar } from './sideBar/SideBar';
import { ChatConteiner } from './chatContainer/ChatConteiner';
import { User, ContactType } from '../../types/User';
import { Data } from '../../types/Data';
import { Chat } from '../../types/Chats';
import { Message } from '../../types/Chats';
import { useState, useEffect } from 'react';

type ChatComponentProps = {
  user: User;
  //handleEvent: (data: Data) => void;
  contacts: ContactType[];
  chats: Chat[];
  participants: ContactType[];
  //ws: WebSocket;
  messages: Message[];
  ws: WebSocket;
  //pdateChat: (c: Chat) => void;
  //chat: Chat | null;
  //updateMessagges: (c: Message[]) => void;

  updateUser: (u: User) => void;
  updateChats: (c: Chat[]) => void;
  updateMessagges: (c: Message[]) => void;
  updateParticipants: (p: ContactType[]) => void;
  updateContacts: (c: ContactType[]) => void;
};

export const ChatApp = (props: ChatComponentProps) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const updateChat = (c: Chat) => {
    setChat(c);
  };

  const handleEvent = (data: Data) => {
    switch (data.status) {
      case 'create chat':
        props.ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'create chat',
            chatID: data.chatId,
            content: data.chatId,
          }),
        );

        break;
      case 'create contact':
        props.ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'create contact',
            chatID: '',
            content: `${data.content}`,
          }),
        );

        return;
      case 'reset contacts':
        props.updateContacts([]);
        break;
      case 'get users':
        props.ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'get users',
            chatID: '',
            content: '',
          }),
        );

        break;
      case 'get messages':
        props.ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'get messages',
            chatID: data.chatId,
            content: '',
          }),
        );

        break;
      case 'send':
        props.ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'send',
            chatID: data.chatId,
            content: data.content,
          }),
        );
        break;
      case 'add user to group':
        props.ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'add user to group',
            chatID: data.chatId,
            content: data.content,
          }),
        );
        break;
      case 'get participants':
        props.ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'get participants',
            chatID: data.chatId,
            content: data.content,
          }),
        );
        break;
      default:
        console.log('Неизвестный статус - ', data.status);
    }
  };

  useEffect(() => {
    props.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log(data.status, chat);
      if (data.status)
        switch (data.status) {
          // case 'auth':
          //   break;
          case 'send':
            console.log(data.id, chat?.chatID);
            if (data.id && (data.id as number) != chat?.chatID) {
              console.log(1);
              break;
            }
            if (data.messages) props.updateMessagges(data.messages);
            break;
          case 'create chat':
            if (data.user) props.updateUser(data.user);
            if (data.conversations) props.updateChats(data.conversations);
            break;
          case 'get users':
            if (data.users) props.updateContacts(data.users);
            break;
          case 'create contact':
            if (data.user) props.updateUser(data.user);
            break;
          case 'get messages':
            //if (data.id && (data.id as number) != chat?.chatID) break;
            props.updateMessagges(data.messages);

            break;
          case 'add user to group':
            break;
          case 'get participants':
            if (data.users) props.updateParticipants(data.users);
            break;
          default:
            console.log('i dont know data status', data.status);
        }
    };
  }, [props.ws, chat]);

  return (
    <div className={styles.chat_background}>
      <SideBar
        user={props.user}
        chats={props.chats}
        contacts={props.contacts}
        handleEvent={handleEvent}
        handleChat={updateChat}
      />
      {chat ? (
        <ChatConteiner
          participants={props.participants}
          // ws={props.ws}
          messages={props.messages}
          // setMessages={props.updateMessagges}
          handleEvent={handleEvent}
          chat={chat}
          user={props.user}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
