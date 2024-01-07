import styles from './Field.module.css';
import { CounterState } from './../../../States';

type FieldProps = {
  //popup: boolean;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  handleState: (state: CounterState) => void;
  state: CounterState;
};

export const Field = (props: FieldProps) => {
  return (
    <div
      className={styles.field}
      onClick={() => {
        props.setPopup(true);
        props.handleState(props.state);
      }}
    >
      {props.text}
    </div>
  );
};
