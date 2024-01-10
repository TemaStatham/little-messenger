import styles from './Messages.module.css';
import { Data } from '../../../../types/Data';
import { Chat, Message } from '../../../../types/Chats';
import { useEffect } from 'react';
import { User } from '../../../../types/User';

type MessagesProps = {
  handleEvent: (data: Data) => void;
  chat: Chat;
  user: User;
  messages: Message[];
};

export const Messages = (props: MessagesProps) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token)
      return () => {
        props.handleEvent({
          status: 'get messages',
          token: token,
          clientID: `${props.chat?.userID}`,
          content: '',
          chatId: `${props.chat?.chatID}`,
        });
      };
  }, []);

  return (
    <>
      {props.messages ? (
        <div className={styles.messages}>
          <div className={styles.messages__messages_block}>
            {props.messages.map((message) => {
              if (message.userID == props.user.id)
                return (
                  <div className={styles.me} key={message.id}>
                    {message.content}
                  </div>
                );
              return (
                <div className={styles.opp} key={message.id}>
                  {message.content}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
