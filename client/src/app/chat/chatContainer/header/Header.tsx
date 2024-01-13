import styles from './Header.module.css';
import { Chat } from '../../../../types/Chats';

type HeaderProps = {
  chat: Chat;
  setSearch: (s: boolean) => void;
  setPerson: (s: boolean) => void;
  setClip: (s: boolean) => void;
};

export const Header = (props: HeaderProps) => {
  // const [imgURL, setImgURL] = useState<string>(props.chat.photo);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.header__group}>
          <img className={styles.group__photo} src={props.chat.photo}></img>
          <div className={styles.group__tittle}>
            <h3>{props.chat.name}</h3>
          </div>
        </div>
        <div className={styles.header__buttons}>
          <div
            className={styles.buttons__search}
            onClick={() => {
              props.setClip(false);
              props.setPerson(false);
              props.setSearch(true);
            }}
          ></div>
          <div
            className={styles.buttons__persons}
            onClick={() => {
              props.setClip(false);
              props.setPerson(true);
              props.setSearch(false);
            }}
          ></div>
          <div
            className={styles.buttons__paper_clip}
            onClick={() => {
              props.setClip(true);
              props.setPerson(false);
              props.setSearch(false);
            }}
          ></div>
        </div>
      </div>
    </>
  );
};
