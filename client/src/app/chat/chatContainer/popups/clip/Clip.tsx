import styles from './Clip.module.css';

type ClipProps = {
  setClip: (s: boolean) => void;
};

export const ClipComponent = (props: ClipProps) => {
  return (
    <>
      <div
        className={styles.background}
        onClick={() => {
          props.setClip(false);
        }}
      ></div>
      <div className={styles.clip}></div>
    </>
  );
};
