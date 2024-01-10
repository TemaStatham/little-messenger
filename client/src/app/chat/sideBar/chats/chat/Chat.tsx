import styles from './Chat.module.css';
import { Chat } from '../../../../../types/Chats';
import { Data } from '../../../../../types/Data';

type ChatComponentProps = {
  chat: Chat;
  handleChat: (c: Chat) => void;
  handleEvent: (data: Data) => void;
};

export const ChatComponent = (props: ChatComponentProps) => {
  return (
    <>
      <div
        className={styles.chat_block}
        key={props.chat.chatID}
        onClick={() => {
          props.handleChat(props.chat);
          const token = localStorage.getItem('token');
          if (token) {
            props.handleEvent({
              status: 'get messages',
              token: token,
              clientID: '',
              content: '',
              chatId: `${props.chat.chatID}`,
            });
          }
        }}
      >
        <div className={styles.chat}>
          <div className={styles.chat__photo}></div>
          <div className={styles.chat__text_block}>
            <div className={styles.text_block__name}>{props.chat.name}</div>
          </div>
        </div>
      </div>
    </>
  );
};
