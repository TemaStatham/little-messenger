import styles from './ShowContact.module.css';
import { CounterState } from '../../States';
import { User } from '../../../../../types/User';

type ShowContactsComponentProps = {
  handleState: (state: CounterState) => void;
  user: User;
};

export const ShowContactsComponent = (props: ShowContactsComponentProps) => {
  return (
    <>
      <div
        className={styles.background}
        onClick={() => {
          props.handleState(CounterState.Null);
        }}
      ></div>
      <div className={styles.popup}>
        {props.user.contacts.map((contact) => (
          <div className={styles.contact}>
            <img className={styles.photo} src={contact.image} width={100}></img>
            <div className={styles.username}>
              {contact.username}
              <div>{contact.firstName}</div>
              <div>{contact.lastName}</div>
              <div>{contact.email}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
