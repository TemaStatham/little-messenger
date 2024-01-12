import styles from './Contact.module.css';
import { CounterState } from '../../../States';
import { ContactType } from '../../../../../../types/User';
import { Data } from '../../../../../../types/Data';

type ContactProps = {
  contact: ContactType;
  handleState: (state: CounterState) => void;
  handleEvent: (data: Data) => void;
};

export const Contact = (props: ContactProps) => {
  return (
    <div
      className={styles.contact}
      onClick={() => {
        props.handleEvent({
          status: 'create contact',
          token: '',
          clientID: '',
          content: `${props.contact.id}`,
          chatId: '',
        });
        props.handleEvent({
          status: 'reset contacts',
          token: '',
          clientID: '',
          content: '',
          chatId: '',
        });
        props.handleState(CounterState.Null);
      }}
    >
      <img className={styles.photo} src={props.contact.image} width={100}></img>
      <div className={styles.username}>{props.contact.username}</div>
    </div>
  );
};
