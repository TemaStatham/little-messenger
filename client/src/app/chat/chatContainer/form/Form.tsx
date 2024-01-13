import styles from './Form.module.css';
import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Data } from '../../../../types/Data';
import { Chat } from '../../../../types/Chats';
//import { Message } from '../../../../types/Chats';

type FormProps = {
  handleEvent: (data: Data) => void;
  chat: Chat;
  // updateMessagges: (m: Message[]) => void;
  // ws: WebSocket;
  //setMessages: (value: React.SetStateAction<Message[]>) => void;
};

export const Form = (props: FormProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (inputValue.length >= 255) {
        alert('Некоректный ввод, сообщение слишком длинное');
      }
      if (inputValue && inputValue.length < 255) {
        props.handleEvent({
          status: 'send',
          token: '',
          clientID: '',
          content: `${inputValue}`,
          chatId: `${props.chat?.chatID}`,
        });
        setInputValue('');
        // props.ws.send(
        //   JSON.stringify({
        //     clientID: localStorage.getItem('token'),
        //     type: 'send',
        //     chatID: `${props.chat?.chatID}`,
        //     content: inputValue,
        //   }),
        // );
        // props.ws.onmessage = (event) => {
        //   console.log(1);
        //   const data = JSON.parse(event.data);
        //   const messages = data.messages as Message[];
        //   //props.setMessages(messages);
        //   props.updateMessagges(messages);
        //   setInputValue('');
        // };
        event.preventDefault();
        return;
      }

      event.preventDefault();
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
