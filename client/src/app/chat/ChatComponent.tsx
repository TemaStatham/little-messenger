import styles from './ChatComponent.module.css';
import { SideBar } from './sideBar/SideBar';
import { ChatConteiner } from './chatContainer/ChatConteiner';
import { User } from '../../types/User';
import { useEffect } from 'react';
import { Data } from '../../types/Data';
import { ContactType } from '../../types/User';

type ChatComponentProps = {
  user: User;
  handleEvent: (data: Data) => void;
  contacts: ContactType[];
};

export const ChatComponent = (props: ChatComponentProps) => {
  useEffect(() => {
    return () => {
      props.handleEvent({
        status: 'someStatus',
        token: 'someToken',
        clientID: 'someClientID',
        content: 'someContent',
        chatId: 'someChatId',
      });
    };
  }, []);
  return (
    <div className={styles.chat_background}>
      <SideBar
        user={props.user}
        contacts={props.contacts}
        handleEvent={props.handleEvent}
      />
      <ChatConteiner user={props.user} />
    </div>
  );
};
