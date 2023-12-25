import styles from './Settings.module.css';
import { Field } from './field/Field';

type SettingsProps = {
  popup: boolean;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Settings = (props: SettingsProps) => {
  return (
    <>
      <div
        className={styles.background}
        onClick={() => {
          props.setPopup(true);
        }}
      ></div>
      <div className={styles.settings} onClick={() => {}}>
        <Field
          popup={props.popup}
          setPopup={props.setPopup}
          text="Создать чат"
        />
        <Field
          popup={props.popup}
          setPopup={props.setPopup}
          text="Добавить контакт"
        />
        <Field popup={props.popup} setPopup={props.setPopup} text="Контакты" />
      </div>
    </>
  );
};
