import styles from './Clip.module.css';
import { Chat } from '../../../../../types/Chats';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { ContactType } from '../../../../../types/User';
import { Data } from '../../../../../types/Data';
//import { Endpoints } from '../../../../../Endpoints';

type ClipProps = {
  setClip: (s: boolean) => void;
  chat: Chat;
  participants: ContactType[];
  handleEvent: (data: Data) => void;
};

export const ClipComponent = (props: ClipProps) => {
  const [imgURL, setImgURL] = useState<string>(props.chat.photo);
  const imgPicker = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // const token = localStorage.getItem('token');
      setImgURL(URL.createObjectURL(selectedFile));
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        console.log('file is undefined');
      }
    }
  };

  const handlePicker = () => {
    imgPicker.current?.click();
  };

  useEffect(() => {
    props.handleEvent({
      status: 'get participants',
      token: '',
      clientID: '',
      content: '',
      chatId: `${props.chat?.chatID}`,
    });
  }, []);

  return (
    <>
      <div
        className={styles.background}
        onClick={() => {
          props.setClip(false);
        }}
      ></div>
      <div className={styles.clip}>
        <img
          width={140}
          src={imgURL}
          className={styles.photo}
          onClick={() => {
            handlePicker();
          }}
        ></img>
        <input
          ref={imgPicker}
          className={styles.profile_input}
          type="file"
          onChange={handleImageChange}
        ></input>
        <h2>{props.chat.name}</h2>
        <div className={styles.conteiner}>
          {props.participants &&
            props.participants.map((p: ContactType) => (
              <div className={styles.parcipant}>
                <img
                  className={styles.parc_photo}
                  src={p.image}
                  width={50}
                ></img>
                <div>{p.username}</div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
