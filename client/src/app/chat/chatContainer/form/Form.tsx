import styles from './Form.module.css';
import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Data } from '../../../../types/Data';
import { Chat } from '../../../../types/Chats';

type FormProps = {
  handleEvent: (data: Data) => void;
  chat: Chat | null;
};

export const Form = (props: FormProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const token = localStorage.getItem('token');
      if (token) {
        props.handleEvent({
          status: 'send',
          token: token,
          clientID: `${props.chat?.userID}`,
          content: inputValue,
          chatId: `${props.chat?.chatID}`,
        });
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
