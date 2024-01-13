import styles from './Person.module.css';
import { User } from '../../../../../types/User';
import { Chat } from '../../../../../types/Chats';
import { Data } from '../../../../../types/Data';
import { useEffect } from 'react';
import { ContactType } from '../../../../../types/User';

type PersonProps = {
  setPerson: (s: boolean) => void;
  user: User;
  //ws: WebSocket;
  chat: Chat;
  handleEvent: (data: Data) => void;
  participants: ContactType[];
};

const contains = (people: ContactType[], targetId: string): boolean => {
  for (const person of people) {
    if (person.id == targetId) {
      return true;
    }
  }
  return false;
};
export const PersonComponent = (props: PersonProps) => {
  useEffect(() => {
    props.handleEvent({
      status: 'get participants',
      token: '',
      clientID: '',
      content: '',
      chatId: `${props.chat?.chatID}`,
    });
  }, []);

  return (
    <>
      <div
        className={styles.background}
        onClick={() => {
          props.setPerson(false);
        }}
      ></div>
      <div className={styles.person}>
        {props.user.contacts.map((contact) => (
          <div
            key={contact.id}
            className={styles.contact}
            onClick={() => {
              if (contains(props.participants, contact.id)) {
                alert('Этот пользователь уже состоит в этой группе ');
                return;
              }
              props.handleEvent({
                status: 'add user to group',
                token: '',
                clientID: '',
                content: `${contact.id}`,
                chatId: `${props.chat?.chatID}`,
              });
              // props.ws.send(
              //   JSON.stringify({
              //     clientID: localStorage.getItem('token'),
              //     type: 'add user to group',
              //     chatID: `${props.chat?.chatID}`,
              //     content: `${contact.id}`,
              //   }),
              // );
              // props.ws.onmessage = (event) => {
              //   const data = JSON.parse(event.data);
              //   console.log(data);
              // };
              setTimeout(() => {
                props.setPerson(false);
              }, 500);
            }}
          >
            <img width={50} src={contact.image} className={styles.photo}></img>
            <div className={styles.name}>
              {contact.username}
              <div> {contact.firstName}</div>
              <div> {contact.lastName}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
