import styles from './Registration.module.css';
import { useState, useEffect } from 'react';
import { Endpoints } from '../../../Endpoints';
import { Field, FieldProps } from './field/Field';

const registrateUser = async (
  name: string,
  lname: string,
  fname: string,
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
        userName: name,
        firstName: fname,
        lastName: lname,
        email: email,
        password: password,
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
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  //const [confirmPass, setConfirmPass] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    if (isValidEmail && pressed) {
      registrateUser(name, fname, lname, email, pass);
    }
    if (!isValidEmail) {
      console.log('Invalid email');
    }
    return () => {
      setPressed(false);
    };
  }, [pressed]);

  const fieldPropsArray: FieldProps[] = [
    {
      tittle: 'Username',
      type: 'text',
      value: name,
      setName: setName,
      placeholder: 'name',
    },
    {
      tittle: 'Имя',
      type: 'text',
      value: fname,
      setName: setFName,
      placeholder: 'fname',
    },
    {
      tittle: 'Фамилия',
      type: 'text',
      value: lname,
      setName: setLName,
      placeholder: 'lname',
    },
    {
      tittle: 'Почта',
      type: 'email',
      value: email,
      setName: setEmail,
      placeholder: 'email',
    },
    {
      tittle: 'Пароль',
      type: 'password',
      value: pass,
      setName: setPass,
      placeholder: 'password',
    },
  ];

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
          {fieldPropsArray.map((fieldProps, index) => (
            <Field key={index} {...fieldProps} />
          ))}
          <button
            onClick={() => setPressed(true)}
            className={styles.form__button}
          >
            Продолжить
          </button>
        </form>
      </div>
    </div>
  );
};
