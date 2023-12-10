import styles from './Header.module.css';

export const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.header__settings_button}></div>
      <div className={styles.header__form}>
        <form className={styles.form}>
          <input className={styles.form__search} type="text"></input>
        </form>
      </div>
    </div>
  );
};
