import styles from './Person.module.css';
import { User } from '../../../../../types/User';
import { Chat } from '../../../../../types/Chats';
import { Data } from '../../../../../types/Data';

type PersonProps = {
  setPerson: (s: boolean) => void;
  user: User;
  //ws: WebSocket;
  chat: Chat;
  handleEvent: (data: Data) => void;
};

export const PersonComponent = (props: PersonProps) => {
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
