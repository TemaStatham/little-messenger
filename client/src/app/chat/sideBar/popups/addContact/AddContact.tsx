import styles from './AddContact.module.css';
import { CounterState } from '../../States';
import { useEffect } from 'react';
import { Contact } from './contact/Contact';
import { Data } from '../../../../../types/Data';
import { ContactType } from '../../../../../types/User';

type AddContactComponentProps = {
  handleState: (state: CounterState) => void;
  handleEvent: (data: Data) => void;
  contacts: ContactType[];
};

export const AddContactComponent = (props: AddContactComponentProps) => {
  useEffect(() => {
    props.handleEvent({
      status: 'get users',
      token: '',
      clientID: '',
      content: '',
      chatId: '',
    });
    return () => {};
  }, []);
  console.log(props.contacts);
  return (
    <>
      <div
        className={styles.background}
        onClick={() => {
          props.handleState(CounterState.Null);
          props.handleEvent({
            status: 'reset contacts',
            token: '',
            clientID: '',
            content: '',
            chatId: '',
          });
        }}
      ></div>
      <div className={styles.popup}>
        <div className={styles.list}>
          {props.contacts.map((contact, index) => (
            <div key={index} className={styles.contactItem}>
              <Contact
                contact={contact}
                handleState={props.handleState}
                handleEvent={props.handleEvent}
              />
            </div>
          ))}
          <div className={styles.footer}></div>
        </div>
      </div>
    </>
  );
};
