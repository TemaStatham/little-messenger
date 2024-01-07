import { ChatComponent } from './chat/ChatComponent';
import { Auth } from './auth/Auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Endpoints } from '../Endpoints';
import { User } from './User';
import { useState, useEffect } from 'react';

const App: React.FC = () => {
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

  // Если пользовтель не аунтефицирован то отправляем на аунтетификацию
  if (!user) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ChatComponent user={user} setUser={setUser} ws={ws} />}
        />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
