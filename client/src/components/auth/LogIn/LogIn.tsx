import styles from './LogIn.module.css';
import { useDebounce } from '../../../hooks/useDebounce';
import { useEffect, useState } from 'react';
import { Endpoints } from '../../../Endpoints';

const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(Endpoints.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      const errorData = await response.json();
      console.error('Ошибка при запросе на сервер:', errorData.message);
    }
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
};

export const LogIn = () => {
  const [email, setEmail] = useDebounce('', 500);
  const [password, setPass] = useDebounce('', 500);
  const [pressed, setPressed] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Проверка валидности почты
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    if (isValidEmail && pressed) {
      loginUser(email, password);
    }
    if (!isValidEmail) {
      setErrorMessage('Некорректный email');
      console.log('Invalid email');
    }
    return () => {
      setPressed(false);
    };
  }, [pressed]);

  return (
    <div className={styles.login}>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <div className={styles.login__form}>
        <div className={styles.login_tittle}>
          <h1>LogIn</h1>
        </div>
        <form className={styles.form}>
          <div className={styles.form__element}>
            <input
              className={styles.element__email}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              required
            />
          </div>
          <div className={styles.form__element}>
            <input
              className={styles.element__password}
              type="password"
              value={password}
              onChange={(e) => setPass(e.target.value)}
              placeholder="password"
              required
            />
          </div>
          <div className={styles.form__element}>
            <button
              onClick={() => setPressed(true)}
              className={styles.element__button}
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
