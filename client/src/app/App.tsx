import { ChatApp } from './chat/ChatApp';
import { Auth } from './auth/Auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Endpoints } from '../Endpoints';
import { ContactType, User } from '../types/User';
//import { Data } from '../types/Data';
import { useState, useEffect } from 'react';
import { Chat, Message } from '../types/Chats';

const checkTokenValidity = async (
  ws: WebSocket,
  setUser: (u: User) => void,
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
  // const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<ContactType[]>([]);
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);
  const ws = new WebSocket(Endpoints.ws);

  const updateUser = (u: User) => {
    setUser(u);
  };

  const updateChats = (c: Chat[]) => {
    setChats(c);
  };

  const updateMessagges = (c: Message[]) => {
    setMessages(c);
  };

  const updateParticipants = (p: ContactType[]) => {
    setParticipants(p);
  };

  const updateContacts = (c: ContactType[]) => {
    setContacts(c);
  };

  // const updateChat = (c: Chat) => {
  //   setChat(c);
  // };

  // const updateMessagges = (c: Message[]) => {
  //   setMessages(c);
  // };

  // useEffect(() => {
  //   console.log(1);
  // }, [chats, chat, messages]);

  // useEffect(() => {
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     //const id = data.id as number;c
  //     const messages = data.messages as Message[];
  //     setMessages(messages);
  //   };
  // }, [ws]);

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
                ws={ws}
                //updateChat={updateChat}
                //chat={chat}
                //ws={ws}
                //handleEvent={handleEvent}
                contacts={contacts}
                chats={chats}
                messages={messages}
                //updateMessagges={updateMessagges}
                participants={participants}
                updateChats={updateChats}
                updateMessagges={updateMessagges}
                updateUser={updateUser}
                updateParticipants={updateParticipants}
                updateContacts={updateContacts}
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
