import { lazy } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import { withAuth } from "./withAuth";

let AuthLayout = lazy(() => import(`@/layouts/AuthLayout`));
let SignIn = lazy(() => import(`@/pages/Auth/SignIn`));
let SignUp = lazy(() => import(`@/pages/Auth/SignUp`));

let SheetsDetail = lazy(() => import(`@/pages/Sheets/Detail`));
let SheetsList = lazy(() => import(`@/pages/Sheets/List`));

let PageNotFound = lazy(() => import(`@/pages/NotFound`));

let routes: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="/sheets/123" replace />,
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: withAuth(SignIn, { redirectIfLoggedIn: true }),
      },
      {
        path: "sign-up",
        element: withAuth(SignUp, { redirectIfLoggedIn: true }),
      },
    ],
  },
  {
    path: "sheets/list",
    element: withAuth(SheetsList),
  },
  {
    path: "sheets/:id",
    element: withAuth(SheetsDetail),
  },
  { path: "*", element: <PageNotFound /> },
];

export const Router = () => {
  return useRoutes(routes);
};

export default Router;
