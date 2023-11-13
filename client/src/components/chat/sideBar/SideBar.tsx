import styles from './SideBar.module.css';
//import { useState } from 'react';
import { Contacts } from './contacts/Contacts';
import { Header } from './header/Header';

export const SideBar = () => {
  //const [counter, setCounter] = useState();
  const fruits: string[] = [
    'Apple',
    'Orange',
    'Banana',
    'ARTEM',
    '',
    'banan',
    'arnold',
    'thomas',
    'shelb',
    'a',
    'asd',
    '$)',
    'bigtits',
    'bigboobs',
    '%$',
    'ad',
  ];

  return (
    <div className={styles.side_bar}>
      <div className={styles.side_bar__header}>
        <Header />
      </div>
      <div className={styles.side_bar__list}>
        <Contacts contacts={fruits} />
      </div>
    </div>
  );
};
