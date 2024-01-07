import styles from './Contact.module.css';
import { CounterState } from '../../../States';
import { User } from '../../../../User';

type ContactProps = {
  id: string;
  username: string;
  fname: string;
  lname: string;
  email: string;
  handleState: (state: CounterState) => void;
  ws: WebSocket;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const Contact = (props: ContactProps) => {
  return (
    <div
      className={styles.contact}
      onClick={() => {
        props.ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'create contact',
            chatID: '',
            content: `${props.id}`,
          }),
        );
        props.ws.onmessage = (event) => {
          console.log(event.data);

          if (event.data.user) {
            props.setUser(event.data.user);
          }
          //window.location.reload();
        };
        props.handleState(CounterState.Null);
      }}
    >
      {props.id}
    </div>
  );
};
