import styles from './Field.module.css';

export type FieldProps = {
  tittle: string;
  type: string;
  value: string;
  setName: (value: React.SetStateAction<string>) => void;
  placeholder: string;
};

export const Field = (props: FieldProps) => {
  return (
    <>
      <div className={styles.form__element}>
        <p>{props.tittle}</p>
        <input
          className={styles.element}
          type={props.type}
          value={props.value}
          onChange={(e) => props.setName(e.target.value)}
          placeholder={props.placeholder}
        />
      </div>
    </>
  );
};
