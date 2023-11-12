import styles from './Header.module.css';

export const Header = () => {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.header__group}>
          <div className={styles.group__photo}></div>
          <div className={styles.group__tittle}>
            <h3>asd</h3>
            <p>z</p>
          </div>
        </div>
        <div className={styles.header__buttons}>
          <div className={styles.buttons__search}></div>
          <div className={styles.buttons__persons}></div>
          <div className={styles.buttons__paper_clip}></div>
          <div className={styles.buttons__dots}></div>
        </div>
      </div>
    </>
  );
};
