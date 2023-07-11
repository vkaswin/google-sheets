import { ChangeEvent } from "react";
import styles from "./Header.module.scss";

let options = [
  { name: "File" },
  { name: "Edit" },
  { name: "View" },
  { name: "Insert" },
  { name: "Format" },
  { name: "Data" },
  { name: "Tools" },
  { name: "Extensions" },
  { name: "Help" },
];

const Header = () => {
  let handleChange = (e: ChangeEvent) => {
    console.log(e);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left_side}>
        <i className="icon-logo"></i>
        <div>
          <div className={styles.title}>
            <input
              name="title"
              value="Untitled spreadsheet"
              onChange={handleChange}
            />
          </div>
          <button>
            <i className="icon-star"></i>
          </button>
          <button>
            <i className="icon-move"></i>
          </button>
          <button>
            <i className="icon-status"></i>
          </button>
          <div className={styles.options}>
            {options.map(({ name }, index) => {
              return <button key={index}>{name}</button>;
            })}
          </div>
        </div>
      </div>
      <div className={styles.right_side}>
        <button>
          <i className="icon-history"></i>
        </button>
        <button>
          <i className="icon-comment"></i>
        </button>
        <button>
          <i className="icon-meet"></i>
          <i className="icon-arrow-down"></i>
        </button>
        <button>
          <i className="icon-lock"></i>
          <span>Share</span>
        </button>
        <div className={styles.avatar}></div>
      </div>
    </div>
  );
};

export default Header;
