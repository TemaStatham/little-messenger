import styles from './Form.module.css';
import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Data } from '../../../../types/Data';
import { Chat } from '../../../../types/Chats';
import { Message } from '../../../../types/Chats';

type FormProps = {
  handleEvent: (data: Data) => void;
  chat: Chat;
  updateMessagges: (m: Message[]) => void;
  ws: WebSocket;
  setMessages: (value: React.SetStateAction<Message[]>) => void;
};

export const Form = (props: FormProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (inputValue) {
        // props.handleEvent({
        //   status: 'send',
        //   token: '',
        //   clientID: `${props.chat?.userID}`,
        //   content: inputValue,
        //   chatId: `${props.chat?.chatID}`,
        // });
        event.preventDefault();
        props.ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'send',
            chatID: `${props.chat?.chatID}`,
            content: inputValue,
          }),
        );
        props.ws.onmessage = (event) => {
          console.log(1);
          const data = JSON.parse(event.data);
          const messages = data.messages as Message[];
          props.setMessages(messages);
          props.updateMessagges(messages);
          console.log(messages);
        };
      }
      setInputValue('');
    }
  };
  return (
    <>
      <form className={styles.form}>
        <input
          className={styles.form__input}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </form>
    </>
  );
};
