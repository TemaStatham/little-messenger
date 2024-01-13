import styles from './ChatApp.module.css';
import { SideBar } from './sideBar/SideBar';
import { ChatConteiner } from './chatContainer/ChatConteiner';
import { User, ContactType } from '../../types/User';
import { Data } from '../../types/Data';
import { useState } from 'react';
import { Chat } from '../../types/Chats';
import { Message } from '../../types/Chats';

type ChatComponentProps = {
  user: User;
  handleEvent: (data: Data) => void;
  contacts: ContactType[];
  chats: Chat[];
  ws: WebSocket;
  messages: Message[];
  updateMessagges: (c: Message[]) => void;
};

export const ChatApp = (props: ChatComponentProps) => {
  const [contact, setContact] = useState<Chat | null>(null);
  const handleChat = (c: Chat) => {
    setContact(c);
  };

  return (
    <div className={styles.chat_background}>
      <SideBar
        user={props.user}
        chats={props.chats}
        contacts={props.contacts}
        handleEvent={props.handleEvent}
        handleChat={handleChat}
      />
      {contact ? (
        <ChatConteiner
          // ws={props.ws}
          messages={props.messages}
          // setMessages={props.updateMessagges}
          handleEvent={props.handleEvent}
          chat={contact}
          user={props.user}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
