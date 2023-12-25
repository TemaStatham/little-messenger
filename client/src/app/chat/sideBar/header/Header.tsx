import styles from './Header.module.css';
import { useState } from 'react';
import { Settings } from './settings/Settings';

export const Header = () => {
  const [popup, setPopup] = useState(true);

  return (
    <div className={styles.header}>
      {popup ? (
        <div
          className={styles.header__settings_button}
          onClick={() => {
            setPopup(false);
          }}
        ></div>
      ) : (
        <Settings popup={popup} setPopup={setPopup} />
      )}

      <div className={styles.header__form}>
        <form className={styles.form}>
          <input className={styles.form__search} type="text"></input>
        </form>
      </div>
    </div>
  );
};
