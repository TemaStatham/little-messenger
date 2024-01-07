import styles from './Contacts.module.css';
import { User } from '../../User';
type ContactsProps = {
  user: User;
};

export const Contacts = (props: ContactsProps) => {
  if (!props.user.contacts) {
    return <></>;
  }

  return (
    <div className={styles.contacts}>
      {props.user.contacts.map((contact) => (
        <div className={styles.contacts__contact} key={contact.id}>
          <div className={styles.contact}>
            <div className={styles.contact__photo}></div>
            <div className={styles.contact__text_block}>
              <div className={styles.text_block__name}>{contact.username}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
