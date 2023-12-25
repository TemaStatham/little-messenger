import styles from './Field.module.css';

type FieldProps = {
  popup: boolean;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
};

export const Field = (props: FieldProps) => {
  return (
    <div
      className={styles.field}
      onClick={() => {
        props.setPopup(true);
      }}
    >
      {props.text}
    </div>
  );
};
