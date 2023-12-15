import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-full bg-[#e3edfd]">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
