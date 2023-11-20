import styles from './Auth.module.css';
import { LogIn } from './logIn/LogIn';
import { Registration } from './registration/Registration';
import { useState } from 'react';

export const Auth: React.FC = () => {
  const [reg, setReg] = useState<boolean>(false);

  const handleChangeReg = (event: boolean) => {
    setReg(event);
  };

  return (
    <div className={styles.auth__сontainer}>
      {reg && <Registration setReg={handleChangeReg} />}
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
};
