import styles from './Chats.module.css';
import { Chat } from '../../../../types/Chats';
import { ChatComponent } from './chat/Chat';
import { Data } from '../../../../types/Data';

type ContactsProps = {
  chats: Chat[];
  handleChat: (c: Chat) => void;
  handleEvent: (data: Data) => void;
};

export const ChatsComponent = (props: ContactsProps) => {
  return (
    <div className={styles.contacts}>
      {props.chats.map((chat) => (
        <ChatComponent
          chat={chat}
          handleChat={props.handleChat}
          handleEvent={props.handleEvent}
          key={chat.chatID}
        />
      ))}
    </div>
  );
};
