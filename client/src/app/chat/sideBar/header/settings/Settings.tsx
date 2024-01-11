import styles from './Settings.module.css';
import { Field } from './field/Field';
import { CounterState } from './../../States';

type SettingsProps = {
  popup: boolean;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  handleState: (state: CounterState) => void;
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
          setPopup={props.setPopup}
          text="Создать чат"
          handleState={props.handleState}
          state={CounterState.CreateChat}
        />
        <Field
          setPopup={props.setPopup}
          text="Добавить контакт"
          handleState={props.handleState}
          state={CounterState.AddContact}
        />
        <Field
          setPopup={props.setPopup}
          text="Контакты"
          handleState={props.handleState}
          state={CounterState.ShowContacts}
        />
        <Field
          setPopup={props.setPopup}
          text="Профиль"
          handleState={props.handleState}
          state={CounterState.Profile}
        />
      </div>
    </>
  );
};
