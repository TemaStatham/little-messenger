import styles from './ChatConteiner.module.css';
import { Form } from './form/Form';
import { OutgoingBlock } from './outgoingBlock/OutgoingBlock';
import { Messages } from './messages/Messagex';
import { Header } from './header/Header';
import { User } from '../../../types/User';
import { Chat, Message } from '../../../types/Chats';
import { Data } from '../../../types/Data';
import { useEffect, useState } from 'react';
import { ClipComponent } from './popups/clip/Clip';
import { PersonComponent } from './popups/person/Person';

type ChatConteinerProps = {
  user: User;
  chat: Chat;
  messages: Message[];
  //setMessages: (c: Message[]) => void;
  handleEvent: (data: Data) => void;
  //ws: WebSocket;
};

export const ChatConteiner = (props: ChatConteinerProps) => {
  // const [messages, setMessages] = useState<Message[]>([]);
  console.log(props.messages);
  useEffect(() => {
    props.handleEvent({
      status: 'get messages',
      token: '',
      clientID: '',
      content: '',
      chatId: `${props.chat?.chatID}`,
    });
    // props.ws.onopen = () => {
    //   props.ws.send(
    //     JSON.stringify({
    //       clientID: localStorage.getItem('token'),
    //       type: 'get messages',
    //       chatID: props.chat?.chatID,
    //       content: '',
    //     }),
    //   );
    // };

    // props.ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   const messages = data.messages as Message[];
    //   props.setMessages(messages);
    //   console.log(messages);
    // };
  }, []);

  // const updateMessagges = (m: Message[]) => {
  //   props.setMessages(m);
  // };

  const [search, setSearch] = useState(false);
  const [person, setPerson] = useState(false);
  const [clip, setClip] = useState(false);

  const updateSearch = (s: boolean) => {
    setSearch(s);
  };

  const updatePerson = (s: boolean) => {
    setPerson(s);
  };

  const updateClip = (s: boolean) => {
    setClip(s);
  };

  if (props.chat) {
    return (
      <>
        <div className={styles.chat_conteiner}>
          <div className={styles.chat_conteiner__header}>
            <Header
              setClip={updateClip}
              setPerson={updatePerson}
              setSearch={updateSearch}
              chat={props.chat}
            />
          </div>
          <div className={styles.chat_conteiner__messages_field}>
            <Messages
              user={props.user}
              messages={props.messages}
              handleEvent={props.handleEvent}
              chat={props.chat}
            />
          </div>
          <div className={styles.chat_conteiner__outgoing_block}>
            <OutgoingBlock />
          </div>
          <div className={styles.chat_conteiner__form}>
            <Form
              //updateMessagges={updateMessagges}
              //ws={props.ws}
              handleEvent={props.handleEvent}
              chat={props.chat}
              // setMessages={props.setMessages}
            />
          </div>
        </div>
        {search ? <></> : <></>}
        {person ? (
          <>
            <PersonComponent
              chat={props.chat}
              handleEvent={props.handleEvent}
              //ws={props.ws}
              user={props.user}
              setPerson={updatePerson}
            />
          </>
        ) : (
          <></>
        )}
        {clip ? (
          <>
            <ClipComponent setClip={updateClip} />
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
};
