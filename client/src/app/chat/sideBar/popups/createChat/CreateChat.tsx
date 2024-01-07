import styles from './CreateChat.module.css';
import { CounterState } from '../../States';
import { User } from '../../../../User';
import { useState } from 'react';

type CreateChatComponentProps = {
  handleState: (state: CounterState) => void;
  ws: WebSocket;
  user: User;
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
            props.ws.send(
              JSON.stringify({
                type: 'create chat',
                clientID: localStorage.getItem('token'),
                chatID: chatName,
              }),
            );
            props.ws.onmessage = (event) => {
              console.log(event.data);
            };
          }}
        >
          Подтвердить
        </div>
      </div>
    </>
  );
};
