import styles from './ChatComponent.module.css';
import { SideBar } from './side-bar/SideBar';
import { ChatConteiner } from './chat-container/ChatConteiner';

export const ChatComponent = () => {
  return (
    <div className={styles.chat_background}>
      <SideBar />
      <ChatConteiner />
    </div>
  );
};
