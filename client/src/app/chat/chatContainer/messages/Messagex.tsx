import React, { useEffect, useRef } from 'react';
import styles from './Messages.module.css';
import { Data } from '../../../../types/Data';
import { Chat, Message } from '../../../../types/Chats';
import { User } from '../../../../types/User';

type MessagesProps = {
  handleEvent: (data: Data) => void;
  chat: Chat;
  user: User;
  messages: Message[];
};

export const Messages = (props: MessagesProps) => {
  const messagesBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      props.handleEvent({
        status: 'get messages',
        token: token,
        clientID: `${props.chat?.userID}`,
        content: '',
        chatId: `${props.chat?.chatID}`,
      });
    }
  }, []);

  useEffect(() => {
    // Когда сообщения обновляются, прокрутите вниз
    return () => {
      if (messagesBlockRef.current) {
        messagesBlockRef.current.scrollTop =
          messagesBlockRef.current.scrollHeight;
      }
    };
  }, [props.messages]);

  const scrollToTop = () => {
    if (messagesBlockRef.current) {
      messagesBlockRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <>
      {props.messages ? (
        <div
          className={styles.messages}
          onClick={scrollToTop}
          ref={messagesBlockRef}
        >
          <div className={styles.messages__messages_block}>
            {props.messages.map((message) => {
              return (
                <div
                  className={
                    message.userID === props.user.id ? styles.me : styles.opp
                  }
                  key={message.id}
                >
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
