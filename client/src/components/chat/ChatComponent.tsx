import styles from './ChatComponent.module.css';
import { SideBar } from './sideBar/SideBar';
import { ChatConteiner } from './chatContainer/ChatConteiner';
import { useEffect, useState } from 'react';
import { Endpoints } from '../../Endpoints';

export const ChatComponent: React.FC = () => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState(null);

  useEffect(() => {
    const checkTokenValidity = async () => {
      // Получение токена из localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        // Токен отсутствует - пользователь не аутентифицирован
        console.log('Токен отсутствует - пользователь не аутентифицирован');
        return;
      }

      try {
        // Проверка валидности токена на сервере
        const response = await fetch(Endpoints.api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Токен невалиден - выполните необходимые действия (например, выход из системы)
          localStorage.removeItem('token');
          return;
        }

        // Токен валиден - получение данных пользователя
        const data = await response.json();
        setUser(data.user);
        setChats(data.chats);
      } catch (error) {
        console.error('Error during token validation:', error);
      }
    };

    checkTokenValidity();
  }, []);

  if (user) {
    console.log(user, chats);
  }

  return (
    <div className={styles.chat_background}>
      <SideBar />
      <ChatConteiner />
    </div>
  );
};
