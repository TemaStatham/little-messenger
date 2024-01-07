import styles from './Header.module.css';
import { useState } from 'react';
import { Settings } from './settings/Settings';
import { CounterState } from './../States';

type HeaderProps = {
  handleState: (state: CounterState) => void;
};

export const Header = (props: HeaderProps) => {
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
        <Settings
          popup={popup}
          setPopup={setPopup}
          handleState={props.handleState}
        />
      )}

      <div className={styles.header__form}>
        <form className={styles.form}>
          <input className={styles.form__search} type="text"></input>
        </form>
      </div>
    </div>
  );
};
