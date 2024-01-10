import styles from './Person.module.css';

type PersonProps = {
  setPerson: (s: boolean) => void;
};

export const PersonComponent = (props: PersonProps) => {
  return (
    <>
      <div
        className={styles.background}
        onClick={() => {
          props.setPerson(false);
        }}
      ></div>
      <div className={styles.person}></div>
    </>
  );
};
