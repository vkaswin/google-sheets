import { lazy } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

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
        element: (
          <ProtectedRoute
            children={<SignIn />}
            isAuthenticated={false}
            redirectIfLogin
          />
        ),
      },
      {
        path: "sign-up",
        element: (
          <ProtectedRoute
            children={<SignUp />}
            isAuthenticated={false}
            redirectIfLogin
          />
        ),
      },
    ],
  },
  {
    path: "sheets/list",
    element: <ProtectedRoute children={<SheetsList />} />,
  },
  {
    path: "sheets/:id",
    element: <ProtectedRoute children={<SheetsDetail />} />,
  },
  { path: "*", element: <PageNotFound /> },
];

export const Router = () => {
  return useRoutes(routes);
};

export default Router;
