import styles from './ChatConteiner.module.css';
import { Form } from './form/Form';
import { OutgoingBlock } from './outgoingBlock/OutgoingBlock';
import { Messages } from './messages/Messagex';
import { Header } from './header/Header';

export const ChatConteiner = () => {
  return (
    <div className={styles.chat_conteiner}>
      <div className={styles.chat_conteiner__header}>
        <Header />
      </div>
      <div className={styles.chat_conteiner__messages_field}>
        <Messages />
      </div>
      <div className={styles.chat_conteiner__outgoing_block}>
        <OutgoingBlock />
      </div>
      <div className={styles.chat_conteiner__form}>
        <Form />
      </div>
    </div>
  );
};
