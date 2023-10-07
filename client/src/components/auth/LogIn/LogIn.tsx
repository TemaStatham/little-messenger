import styles from './LogIn.module.css';
import { useState } from 'react';

export function LogIn() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  return (
    <div className={styles.login}>
      <div className={styles.login__form}>
        <div className={styles.login_tittle}>
          <h1>LogIn</h1>
        </div>
        <form className={styles.form}>
          <div className={styles.form__element}>
            <input
              className={styles.element__email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
            />
          </div>
          <div className={styles.form__element}>
            <input
              className={styles.element__password}
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="password"
            />
          </div>
          <div className={styles.form__element}>
            <button className={styles.element__button}>Войти</button>
          </div>
          {/* <button onClick={() => handleClick(email, pass)}>{Войти}</button> */}
        </form>
      </div>
    </div>
  );
}
