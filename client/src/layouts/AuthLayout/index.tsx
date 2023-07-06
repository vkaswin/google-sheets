import { Outlet } from "react-router-dom";

import styles from "./AuthLayout.module.scss";

const AuthLayout = () => {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
