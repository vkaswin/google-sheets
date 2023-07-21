import styles from "./Toolbar.module.scss";

const Toolbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left_wrapper}>
          <div className={styles.logo}>
            <img src="/logo.png" />
          </div>
          <div className={styles.options_wrapper}>
            <div className={styles.options_top}>
              <div className={styles.title_field} contentEditable={false}>
                Untitled Spreadsheet
              </div>
              <i className="icon-star-outline"></i>
              <i className="icon-folder-move-outline"></i>
              <i className="icon-cloud-check-outline"></i>
            </div>
            <div className={styles.options_bottom}>
              <button>File</button>
              <button>Edit</button>
            </div>
          </div>
        </div>
        <div className={styles.right_wrapper}></div>

        {/* <i className="icon-history"></i>
        <i className="icon-comment-text-outline"></i>
        <i className="icon-lock-outline"></i>
        <img src="https://lh3.googleusercontent.com/ogw/AGvuzYbYUvEKxa6rFyPYlmSyOB0iLAYbAvNNCnB4PZS0fg=s32-c-mo" /> */}
      </div>
      <div className={styles.toolar}>Toolbar</div>
    </div>
  );
};

export default Toolbar;
