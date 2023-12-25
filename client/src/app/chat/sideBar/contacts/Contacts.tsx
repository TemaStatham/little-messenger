import styles from './Contacts.module.css';

type ContactsProps = {
  contacts: string[];
};

export const Contacts = (props: ContactsProps) => {
  if (!props.contacts) {
    return <></>;
  }

  return (
    <div className={styles.contacts}>
      {props.contacts.map((contact) => (
        <div className={styles.contacts__contact} key={contact}>
          <div className={styles.contact}>
            <div className={styles.contact__photo}></div>
            <div className={styles.contact__text_block}>
              <div className={styles.text_block__name}>{contact}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
