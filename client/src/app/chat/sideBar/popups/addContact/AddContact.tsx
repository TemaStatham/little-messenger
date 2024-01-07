import styles from './AddContact.module.css';
import { CounterState } from '../../States';
import { useEffect, useState } from 'react';
import { Contact } from './contact/Contact';
import { User } from '../../../User';

type AddContactComponentProps = {
  handleState: (state: CounterState) => void;
  ws: WebSocket;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

type Contact = {
  id: string;
  username: string;
  fname: string;
  lname: string;
  email: string;
};

const GetContacts = (
  ws: WebSocket,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
): Promise<Contact[]> => {
  return new Promise((resolve) => {
    ws.send(
      JSON.stringify({
        clientID: localStorage.getItem('token'),
        type: 'get users',
        chatID: '',
        content: '',
      }),
    );
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const users = data.users as Contact[];
      resolve(users);
      if (data.user) {
        setUser(data.user);
      }
    };
  });
};

export const AddContactComponent = (props: AddContactComponentProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  useEffect(() => {
    GetContacts(props.ws, props.setUser)
      .then((users) => {
        setContacts(users);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);
  return (
    <>
      <div
        className={styles.background}
        onClick={() => {
          props.handleState(CounterState.Null);
        }}
      ></div>
      <div
        className={styles.popup}
        //onClick={() => props.handleState(CounterState.Null)}
      >
        <div className={styles.list}>
          {contacts.map((contact, index) => (
            <div key={index} className={styles.contactItem}>
              <Contact
                id={contact.id}
                username={contact.username}
                fname={contact.fname}
                lname={contact.lname}
                email={contact.username}
                handleState={props.handleState}
                ws={props.ws}
                setUser={props.setUser}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
