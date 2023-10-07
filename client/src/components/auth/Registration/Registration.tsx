import styles from './Registration.module.css';
import { useState } from 'react';

type RegistrationProps = {
  setReg: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Registration = (props: RegistrationProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  return (
    <div
      className={styles.registration}
      onClick={() => {
        props.setReg(false);
      }}
    >
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
          <button className={styles.form__button}>Зарегестрироваться</button>
        </form>
      </div>
    </div>
  );
};
