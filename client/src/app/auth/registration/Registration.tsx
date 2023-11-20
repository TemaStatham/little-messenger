import styles from './Registration.module.css';
import { useState, useEffect } from 'react';
import { Endpoints } from '../../../Endpoints';

const registrateUser = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const response = await fetch(Endpoints.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: 25,
        googleImage: 'https://example.com/image.jpg',
        firstName: 'John',
        lastName: 'Doe',
        userName: name,
        email: email,
        password: password,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      //window.location.assign('http://localhost:3000');
    } else {
      const errorData = await response.json();
      console.error('Ошибка при запросе на сервер:', errorData.message);
    }
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
};

type RegistrationProps = {
  setReg: (event: boolean) => void;
};

export const Registration = (props: RegistrationProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  // const [errorMessage, setErrorMessage] = useState('');
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    if (isValidEmail && pressed) {
      registrateUser(name, email, pass);
    }
    if (!isValidEmail) {
      //setErrorMessage('Некорректный email');
      console.log('Invalid email');
    }
    return () => {
      setPressed(false);
    };
  }, [pressed]);

  return (
    <div className={styles.registration}>
      <div
        className={styles.registration__hide_see_button}
        onClick={() => {
          props.setReg(false);
        }}
      ></div>
      <div className={styles.registration__form}>
        <div className={styles.registration__tittle}>Регистрация</div>
        <form className={styles.form}>
          <div className={styles.form__element}>
            <p>Имя</p>
            <input
              className={styles.element}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="name"
            />
          </div>
          <div className={styles.form__element}>
            <p>Почта</p>
            <input
              className={styles.element}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
            />
          </div>
          <div className={styles.form__element}>
            <p>Пароль</p>
            <input
              className={styles.element}
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="password"
            />
          </div>
          <div className={styles.form__element}>
            <p>Подтвердите пароль</p>
            <input
              className={styles.element}
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="password"
            />
          </div>
          <button
            onClick={() => setPressed(true)}
            className={styles.form__button}
          >
            Зарегестрироваться
          </button>
        </form>
      </div>
    </div>
  );
};
