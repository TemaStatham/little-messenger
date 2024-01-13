import styles from './Header.module.css';
import { useState } from 'react';
import { Settings } from './settings/Settings';
import { CounterState } from './../States';
import { Chat } from '../../../../types/Chats';

type HeaderProps = {
  handleState: (state: CounterState) => void;
  chats: Chat[];
  updateSearchValue: (s: string) => void;
};

export const HeaderComponent = (props: HeaderProps) => {
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
          <input
            className={styles.form__search}
            type="text"
            onChange={(e) => props.updateSearchValue(e.target.value)}
          ></input>
        </form>
      </div>
    </div>
  );
};
