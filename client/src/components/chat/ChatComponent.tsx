import styles from './ChatComponent.module.css';
import { SideBar } from './side-bar/SideBar';
import { ChatConteiner } from './chat-container/ChatConteiner';

export const ChatComponent: React.FC = () => {
  return (
    <div className={styles.chat_background}>
      <SideBar />
      <ChatConteiner />
    </div>
  );
};
