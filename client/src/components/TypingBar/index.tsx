import styles from "./TypingBar.module.scss";

const TypingBar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.id_field}>
        <input name="id" />
      </div>
      <div className={styles.seperator}></div>
      <div className={styles.content_field}>
        <i className="bx-text"></i>
        <input name="content" />
      </div>
    </div>
  );
};

export default TypingBar;
