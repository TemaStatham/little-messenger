import styles from './ChatConteiner.module.css';
import { Form } from './form/Form';
import { OutgoingBlock } from './outgoingBlock/OutgoingBlock';
import { Messages } from './messages/Messagex';
import { Header } from './header/Header';
import { User } from '../../../types/User';
import { Chat, Message } from '../../../types/Chats';
import { Data } from '../../../types/Data';

type ChatConteinerProps = {
  user: User;
  chat: Chat | null;
  messages: Message[];
  handleEvent: (data: Data) => void;
};

export const ChatConteiner = (props: ChatConteinerProps) => {
  if (props.chat == null) {
    return <></>;
  }

  if (props.chat) {
    return (
      <div className={styles.chat_conteiner}>
        <div className={styles.chat_conteiner__header}>
          <Header chat={props.chat} />
        </div>
        <div className={styles.chat_conteiner__messages_field}>
          <Messages
            user={props.user}
            messages={props.messages}
            handleEvent={props.handleEvent}
            chat={props.chat}
          />
        </div>
        <div className={styles.chat_conteiner__outgoing_block}>
          <OutgoingBlock />
        </div>
        <div className={styles.chat_conteiner__form}>
          <Form handleEvent={props.handleEvent} chat={props.chat} />
        </div>
      </div>
    );
  }
};
