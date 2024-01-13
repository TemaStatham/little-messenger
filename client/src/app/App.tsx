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
    }
    if (data.conversations) {
      setChats(data.conversations);
    }
    return;
  };
};

// type AppProps = {
//   user: User | null;
//   chats: Chat[];
//   message: Message[];
//   contacts: ContactType[];
//   setUser: (u: User | null) => void;
//   setChats: (c: Chat[]) => void;
//   setMessages: (m: Message[]) => void;
//   setContacts: (m: ContactType[]) => void;
// };

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<ContactType[]>([]);
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
      case 'add user to group':
        ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'add user to group',
            chatID: data.chatId,
            content: data.content,
          }),
        );
        return;
      case 'get participants':
        ws.send(
          JSON.stringify({
            clientID: localStorage.getItem('token'),
            type: 'get participants',
            chatID: data.chatId,
            content: data.content,
          }),
        );
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const messages = data.users as ContactType[];
          setParticipants(messages);
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

  // const updateMessagges = (c: Message[]) => {
  //   setMessages(c);
  // };

  useEffect(() => {
    const checkAuth = async () => {
      await checkTokenValidity(ws, updateUser, updateChats);
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
                //ws={ws}
                handleEvent={handleEvent}
                contacts={contacts}
                chats={chats}
                messages={messages}
                //updateMessagges={updateMessagges}
                participants={participants}
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
