import { ChatComponent } from './chat/ChatComponent';
import { Auth } from './auth/Auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Endpoints } from '../Endpoints';
import { ContactType, User } from '../types/User';
import { Data } from '../types/Data';
import { useState, useEffect } from 'react';

const checkTokenValidity = async (
  ws: WebSocket,
  setUser: (u: User | null) => void,
) => {
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
    return;
  };
  setUser(null);
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);
  const ws = new WebSocket(Endpoints.ws);

  const handleEvent = (data: Data) => {
    switch (data.status) {
      case 'create chat':
        ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'create chat',
            chatID: data.chatId,
            content: ``,
          }),
        );
        ws.onmessage = (event) => {
          console.log(event.data);
          const data = JSON.parse(event.data);
          const user = data.user as User;
          setUser(user);
        };
        return;
      case 'create contact':
        ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'create contact',
            chatID: '',
            content: `${data.content}`,
          }),
        );
        ws.onmessage = (event) => {
          console.log(event.data);
          const data = JSON.parse(event.data);
          const user = data.user as User;
          setUser(user);
        };
        return;
      case 'reset contacts':
        setContacts([]);
        return;
      case 'get users':
        ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'get users',
            chatID: '',
            content: '',
          }),
        );
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const users = data.users as ContactType[];
          setContacts(users);
        };
        return;
      default:
        console.log('Неизвестный статус - ', data.status);
    }
  };

  const updateUser = (u: User | null) => {
    setUser(u);
  };

  useEffect(() => {
    const checkAuth = async () => {
      await checkTokenValidity(ws, updateUser);
      setIsLoading(false);
    };
    return () => {
      checkAuth();
    };
  }, []);

  // Если пользовтель не аутентифицирован или данные загружаются, показываем Auth
  if (user == null || loading) {
    // Искусственная задержка в 1 секунду перед отображением Auth
    setTimeout(() => {
      return <Auth />;
    }, 1000);
  }

  if (user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ChatComponent
                user={user}
                handleEvent={handleEvent}
                contacts={contacts}
              />
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    );
  }
};

export default App;
