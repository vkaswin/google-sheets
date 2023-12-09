import { Fragment, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { cookie } from "@/utils";

type ProtectedRouteProps = {
  children: ReactNode;
  isAuthenticated?: boolean;
  redirectIfLogin?: boolean;
};

const ProtectedRoute = ({
  children,
  isAuthenticated = true,
  redirectIfLogin = false,
}: ProtectedRouteProps) => {
  let authToken = cookie.get("auth_token");

  if (authToken && redirectIfLogin)
    return <Navigate replace to="/sheet/list" />;

  if (isAuthenticated && !authToken)
    return <Navigate replace to="/auth/sign-in" />;

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
