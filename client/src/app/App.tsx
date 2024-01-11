import { ChatApp } from './chat/ChatApp';
import { Auth } from './auth/Auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Endpoints } from '../Endpoints';
import { ContactType, User } from '../types/User';
import { Data } from '../types/Data';
import { useState, useEffect } from 'react';
import { Chat, Message } from '../types/Chats';

const checkTokenValidity = async (
  ws: WebSocket,
  setUser: (u: User | null) => void,
  setChats: (c: Chat[]) => void,
  setMessages: (m: Message[]) => void,
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
    const data = JSON.parse(event.data);
    if (data.user) {
      setUser(data.user);
      setMessages([]);
    }
    if (data.conversations) {
      setChats(data.conversations);
      setMessages([]);
    }
    return;
  };
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
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
            content: data.chatId,
          }),
        );
        ws.onmessage = (event) => {
          console.log(event.data);
          const data = JSON.parse(event.data);
          if (data.user) setUser(data.user);
          if (data.conversations) setChats(data.conversations);
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
      case 'get messages':
        ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'get messages',
            chatID: data.chatId,
            content: '',
          }),
        );
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const messages = data.messages as Message[];
          setMessages(messages);
          console.log(messages);
        };
        return;
      case 'send':
        ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'send',
            chatID: data.chatId,
            content: data.content,
          }),
        );
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const messages = data.messages as Message[];
          setMessages(messages);
          console.log(messages);
        };
        return;
      case 'change profile':
        ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'change profile',
            chatID: data.chatId,
            content: data.content,
          }),
        );
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const messages = data.messages as Message[];
          setMessages(messages);
          console.log(messages);
        };
        return;
      default:
        console.log('Неизвестный статус - ', data.status);
    }
  };

  const updateUser = (u: User | null) => {
    setUser(u);
  };

  const updateChats = (c: Chat[]) => {
    setChats(c);
  };

  const updateMessages = (m: Message[]) => {
    setMessages(m);
  };

  useEffect(() => {
    const checkAuth = async () => {
      await checkTokenValidity(ws, updateUser, updateChats, updateMessages);
    };
    checkAuth();
    return () => {
      setIsLoading(false);
    };
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {user ? (
          <Route
            path="/"
            element={
              <ChatApp
                user={user}
                handleEvent={handleEvent}
                contacts={contacts}
                chats={chats}
                messages={messages}
              />
            }
          />
        ) : (
          <Route
            path="/"
            element={
              <div>
                <div
                  onClick={() => {
                    window.location.assign('http://localhost:3000/auth');
                  }}
                >
                  Авторизироваться
                </div>
              </div>
            }
          />
        )}
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
