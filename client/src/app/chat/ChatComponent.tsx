import styles from './ChatComponent.module.css';
import { SideBar } from './sideBar/SideBar';
import { ChatConteiner } from './chatContainer/ChatConteiner';
import { useEffect, useState } from 'react';
import { Endpoints } from '../../Endpoints';

export const ChatComponent: React.FC = () => {
  // const [user, setUser] = useState(null);
  const [chats, setChats] = useState<string[]>([]);

  const ws = new WebSocket(Endpoints.ws);

  useEffect(() => {
    const checkTokenValidity = async (ws: WebSocket) => {
      // Получение токена из localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        // Токен отсутствует - пользователь не аутентифицирован
        console.log('Токен отсутствует - пользователь не аутентифицирован');
        return;
      }

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            chatID: '',
            type: 'auth',
            content: '',
          }),
        );
      };

      ws.onmessage = (event) => {
        console.log(event.data);
        setChats(event.data.Chat);
      };
    };

    checkTokenValidity(ws);
  }, []);

  // if (user) {
  //   console.log(user, chats);
  // }

  return (
    <div className={styles.chat_background}>
      <SideBar chats={chats} />
      <ChatConteiner />
    </div>
  );
};
