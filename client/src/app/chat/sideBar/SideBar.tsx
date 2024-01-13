import styles from './SideBar.module.css';
import { useEffect, useState } from 'react';
import { ChatsComponent } from './chats/Chats';
import { HeaderComponent } from './header/Header';
import { CounterState } from './States';
import { AddContactComponent } from './popups/addContact/AddContact';
import { CreateChatComponent } from './popups/createChat/CreateChat';
import { ShowContactsComponent } from './popups/showContact/ShowContact';
import { User } from '../../../types/User';
import { Data } from '../../../types/Data';
import { ContactType } from '../../../types/User';
import { Chat } from '../../../types/Chats';
import { ProfileComponent } from './popups/profile/Profile';

type SideBarProps = {
  user: User;
  contacts: ContactType[];
  chats: Chat[];
  handleEvent: (data: Data) => void;
  handleChat: (c: Chat) => void;
};

export const SideBar = (props: SideBarProps) => {
  const [state, setState] = useState<CounterState>(CounterState.Null);
  const handleState = (state: CounterState) => {
    setState(state);
  };

  const [chats, setChats] = useState<Chat[]>([]);

  const [searchValue, setSearchValue] = useState('');

  const updateSearchValue = (s: string) => {
    setSearchValue(s);
  };

  useEffect(() => {
    setChats(
      props.chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    );
  }, [searchValue]);

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
      {state === CounterState.Profile && (
        <ProfileComponent
          user={props.user}
          handleEvent={props.handleEvent}
          handleState={handleState}
        />
      )}
      <div className={styles.side_bar__header}>
        <HeaderComponent
          updateSearchValue={updateSearchValue}
          chats={props.chats}
          handleState={handleState}
        />
      </div>
      <div className={styles.side_bar__list}>
        <ChatsComponent
          handleEvent={props.handleEvent}
          handleChat={props.handleChat}
          chats={chats}
        />
      </div>
    </div>
  );
};
