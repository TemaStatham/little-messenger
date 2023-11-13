import styles from './Contacts.module.css';

type ContactsProps = {
  contacts: string[];
};

export const Contacts = (props: ContactsProps) => {
  return (
    <div className={styles.contacts}>
      {props.contacts.map((contact) => (
        <div className={styles.contacts__contact} key={contact}>
          <div className={styles.contact}>
            <div className={styles.contact__photo}></div>
            <div className={styles.contact__text_block}>
              <div className={styles.text_block__name}>{contact}</div>
              <div className={styles.text_block__last_message}>message</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
