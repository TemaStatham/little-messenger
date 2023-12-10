import styles from './SideBar.module.css';
//import { useState } from 'react';
import { Contacts } from './contacts/Contacts';
import { Header } from './header/Header';

type SideBarProps = {
  chats: string[];
};

export const SideBar = (props: SideBarProps) => {
  //const [counter, setCounter] = useState();

  return (
    <div className={styles.side_bar}>
      <div className={styles.side_bar__header}>
        <Header />
      </div>
      <div className={styles.side_bar__list}>
        <Contacts contacts={props.chats} />
      </div>
    </div>
  );
};
