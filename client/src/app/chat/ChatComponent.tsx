import styles from './ChatComponent.module.css';
import { SideBar } from './sideBar/SideBar';
import { ChatConteiner } from './chatContainer/ChatConteiner';
import { useEffect, useState } from 'react';
import { Endpoints } from '../../Endpoints';
import { User } from './User';

export const ChatComponent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const ws = new WebSocket(Endpoints.ws);
  useEffect(() => {
    console.log('UserProfile был обновлен. Новые данные пользователя:', user);
  }, [user]);

  useEffect(() => {
    const checkTokenValidity = async (ws: WebSocket) => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Токен отсутствует - пользователь не аутентифицирован');
        return;
      }

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            clientID: token,
            type: 'auth',
            chatID: '',
            content: '',
          }),
        );
      };
      ws.onmessage = (event) => {
        console.log(event.data);
        const data = JSON.parse(event.data);
        if (data.user) {
          setUser(data.user);
        }
      };
    };

    checkTokenValidity(ws);
  }, []);

  if (!user) {
    return <></>;
  }

  return (
    <div className={styles.chat_background}>
      <SideBar setUser={setUser} user={user} ws={ws} />
      <ChatConteiner setUser={setUser} user={user} />
    </div>
  );
};
