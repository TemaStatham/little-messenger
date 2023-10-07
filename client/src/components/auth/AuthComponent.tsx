import styles from './AuthComponent.module.css';
import { LogIn } from './LogIn/LogIn';
import { Registration } from './Registration/Registration';
import { useState } from 'react';

export function AuthComponent() {
  const [reg, setReg] = useState<boolean>(false);
  if (reg) {
    console.log('hello');
  } else {
    console.log('gooodbye');
  }
  return (
    <div className={styles.auth__сontainer}>
      {reg && <Registration setReg={setReg} />}
      <div className={styles.сontainer__сomponent}>
        <div className={styles.component__element}>
          <div className={styles.element__tittle}>
            <h1>Добро пожаловать</h1>
          </div>
          <div className={styles.element__description}>
            <p>
              Войдите в приложение, если вы еще не зарегестрировались сначала
              пройдите регистрацию
            </p>
          </div>
          <div className={styles.element__registration_button}>
            <button
              className={styles.registration_button}
              onClick={() => setReg(true)}
            >
              Зарегестрироваться
            </button>
          </div>
        </div>
        <div className={styles.component__element}>
          <div className={styles.element_login}>
            <LogIn />
          </div>
        </div>
      </div>
    </div>
  );
}
