import styles from './ShowContact.module.css';
import { CounterState } from '../../States';
import { User } from '../../../User';

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
          <div>{contact.email}</div>
        ))}
      </div>
    </>
  );
};
