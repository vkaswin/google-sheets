import { FC, JSX } from "react";
import { cookie } from "@/utils";
import { Navigate } from "react-router-dom";

type IWithAuth = (
  Component: FC,
  options?: {
    redirectIfLoggedIn?: boolean;
    isAuthenticated?: boolean;
  }
) => JSX.Element;

export const withAuth: IWithAuth = (Component: FC, options) => {
  let { redirectIfLoggedIn = false, isAuthenticated = true } = options || {};

  //   let authToken = cookie.get("auth_token");

  //   if (redirectIfLoggedIn && authToken)
  //     return <Navigate to="/sheets/list" replace />;

  //   if (!authToken && isAuthenticated)
  //     return <Navigate to="/auth/sign-in" replace />;

  return <Component />;
};
