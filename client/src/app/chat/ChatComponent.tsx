import styles from './ChatComponent.module.css';
import { SideBar } from './sideBar/SideBar';
import { ChatConteiner } from './chatContainer/ChatConteiner';
import { User } from '../User';

type ChatComponentProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  ws: WebSocket;
};

export const ChatComponent = (props: ChatComponentProps) => {
  return (
    <div className={styles.chat_background}>
      <SideBar setUser={props.setUser} user={props.user} ws={props.ws} />
      <ChatConteiner setUser={props.setUser} user={props.user} />
    </div>
  );
};
