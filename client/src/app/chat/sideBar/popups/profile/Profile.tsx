import styles from './Profile.module.css';
import { CounterState } from '../../States';
import { User } from '../../../../../types/User';
import { Data } from '../../../../../types/Data';
import { useState, ChangeEvent, useRef } from 'react';
import { Endpoints } from '../../../../../Endpoints';

type ProfileProps = {
  handleState: (state: CounterState) => void;
  user: User;
  handleEvent: (data: Data) => void;
};

export const ProfileComponent = (props: ProfileProps) => {
  const [imgURL, setImgURL] = useState<string>(props.user.imageURL);
  console.log(imgURL);
  const [username, setUsername] = useState<string>(props.user.username);
  const [email, setEmail] = useState<string>(props.user.email);
  const [firstName, setFirstName] = useState<string>(props.user.firstName);
  const [lastName, setLastName] = useState<string>(props.user.lastName);

  const imgPicker = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImgURL(URL.createObjectURL(selectedFile));

      //setFile(selectedFile);
    }
  };

  const handlePicker = () => {
    imgPicker.current?.click();
  };

  return (
    <>
      <div
        className={styles.background}
        onClick={() => {
          props.handleState(CounterState.Null);
        }}
      ></div>

      <div className={styles.profile}>
        <img
          className={styles.profile_img}
          onClick={() => {
            handlePicker();
          }}
          //style={{ backgroundImage: `url(${imgURL})` }}
          src={imgURL}
        ></img>
        <input
          ref={imgPicker}
          className={styles.profile_input}
          type="file"
          onChange={handleImageChange}
        />

        <div className={styles.profile_field}>
          <label>Никнейм</label>
          <input
            className={styles.input_username}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.profile_field}>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.profile_field}>
          <label>Имя</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className={styles.profile_field}>
          <label>Фамилия</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div
          className={styles.save}
          onClick={async () => {
            // props.handleState(CounterState.Null);
            const token = localStorage.getItem('token');
            console.log(imgPicker.current?.files?.[0]);
            const formData = new FormData();
            const selectedFile = imgPicker.current?.files?.[0];

            if (selectedFile) {
              formData.append('file', selectedFile);
            } else {
              console.log('file is undefined');
            }

            formData.append('id', props.user.id);
            formData.append('username', username);
            formData.append('email', email);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('imageURL', imgURL);

            try {
              const response = await fetch(Endpoints.upload, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              });
              console.log(response);
              // Обработка ответа от сервера
              if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                const data = responseData.filePath
                  .replace(/\\/g, '/')
                  .substring(1);

                setImgURL(`${Endpoints.static}${data}`);

                if (token) {
                  props.handleEvent({
                    status: 'change profile',
                    token: token,
                    clientID: token,
                    content: JSON.stringify({
                      id: props.user.id,
                      username: username,
                      email: email,
                      firstName: firstName,
                      lastName: lastName,
                      imageURL: [imgURL],
                    }),
                    chatId: ``,
                  });
                }
              } else {
                console.error('Ошибка при сохранении профиля');
              }
            } catch (error) {
              console.error('Ошибка при выполнении запроса:', error);
            }
          }}
        >
          Сохранить
        </div>
      </div>
    </>
  );
};
