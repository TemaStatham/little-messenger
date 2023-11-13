import styles from './ChatComponent.module.css';
import { SideBar } from './sideBar/SideBar';
import { ChatConteiner } from './chatContainer/ChatConteiner';

export const ChatComponent: React.FC = () => {
  return (
    <div className={styles.chat_background}>
      <SideBar />
      <ChatConteiner />
    </div>
  );
};
