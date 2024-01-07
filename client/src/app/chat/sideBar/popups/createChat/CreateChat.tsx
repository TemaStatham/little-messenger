import styles from './CreateChat.module.css';
import { CounterState } from '../../States';
import { User } from '../../../../../types/User';
import { useState } from 'react';
import { Data } from '../../../../../types/Data';

type CreateChatComponentProps = {
  handleState: (state: CounterState) => void;
  user: User;
  handleEvent: (data: Data) => void;
};

export const CreateChatComponent = (props: CreateChatComponentProps) => {
  const [chatName, setChatName] = useState<string>('');
  return (
    <>
      <div
        className={styles.popup_background}
        onClick={() => props.handleState(CounterState.Null)}
      ></div>
      <div className={styles.popup}>
        <input
          className={styles.chatname}
          type="text"
          placeholder="Введите название чата"
          id="chatNameInput"
          onChange={(e) => setChatName(e.target.value)}
        />
        <div className={styles.list} id="contactsList">
          {props.user.contacts.map((contact) => (
            <div>{contact.email}</div>
          ))}
        </div>
        <div
          className={styles.confirm}
          onClick={() => {
            props.handleState(CounterState.Null);
            props.handleEvent({
              status: 'create chat',
              token: '',
              clientID: '',
              content: '',
              chatId: `${chatName}`,
            });
          }}
        >
          Подтвердить
        </div>
      </div>
    </>
  );
};
