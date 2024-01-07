import styles from './SideBar.module.css';
import { useState } from 'react';
import { Contacts } from './contacts/Contacts';
import { Header } from './header/Header';
import { CounterState } from './States';
import { AddContactComponent } from './popups/addContact/AddContact';
import { CreateChatComponent } from './popups/createChat/CreateChat';
import { ShowContactsComponent } from './popups/showContact/ShowContact';
import { User } from '../../../types/User';
import { Data } from '../../../types/Data';
import { ContactType } from '../../../types/User';

type SideBarProps = {
  user: User;
  handleEvent: (data: Data) => void;
  contacts: ContactType[];
};

export const SideBar = (props: SideBarProps) => {
  const [state, setState] = useState<CounterState>(CounterState.Null);
  const handleState = (state: CounterState) => {
    setState(state);
  };

  return (
    <div className={styles.side_bar}>
      {state === CounterState.CreateChat && (
        <CreateChatComponent
          handleEvent={props.handleEvent}
          user={props.user}
          handleState={handleState}
        />
      )}
      {state === CounterState.AddContact && (
        <AddContactComponent
          handleState={handleState}
          handleEvent={props.handleEvent}
          contacts={props.contacts}
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
