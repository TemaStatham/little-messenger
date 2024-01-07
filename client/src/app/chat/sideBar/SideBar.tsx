import styles from './SideBar.module.css';
import { useState } from 'react';
import { Contacts } from './contacts/Contacts';
import { Header } from './header/Header';
import { CounterState } from './States';
import { AddContactComponent } from './popups/addContact/AddContact';
import { CreateChatComponent } from './popups/createChat/CreateChat';
import { ShowContactsComponent } from './popups/showContact/ShowContact';
import { User } from './../User';

type SideBarProps = {
  ws: WebSocket;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const SideBar = (props: SideBarProps) => {
  const [state, setState] = useState<CounterState>(CounterState.Null);
  const handleState = (state: CounterState) => {
    setState(state);
  };

  if (props.user == null) {
    return <></>;
  }

  return (
    <div className={styles.side_bar}>
      {state === CounterState.CreateChat && (
        <CreateChatComponent
          user={props.user}
          ws={props.ws}
          handleState={handleState}
        />
      )}
      {state === CounterState.AddContact && (
        <AddContactComponent
          setUser={props.setUser}
          ws={props.ws}
          handleState={handleState}
        />
      )}
      {state === CounterState.ShowContacts && (
        <ShowContactsComponent user={props.user} handleState={handleState} />
      )}
      <div className={styles.side_bar__header}>
        <Header handleState={handleState} />
      </div>
      <div className={styles.side_bar__list}>
        <Contacts user={props.user} />
      </div>
    </div>
  );
};
