import styles from './Messages.module.css';

export const Messages = () => {
  return (
    <>
      <div className={styles.messages}>
        <div className={styles.meassages__meassages_block}></div>
        <div className={styles.messages__form}>
          <form className={styles.form}>
            <input className={styles.form__input} type="text"></input>
          </form>
        </div>
      </div>
    </>
  );
};
