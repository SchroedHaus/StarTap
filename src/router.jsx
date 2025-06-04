import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import PrivateRoute from "./components/PrivateRoute";
import UserProfile from "./components/UserProfile";
import ReviewRequest from "./components/ReviewRequest";
import ResetPassword from "./components/ResetPassword";
import UpdatePassword from "./components/UpdatePassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Signin /> },
      { path: "/signup", element: <Signup /> },

      { path: "/signin", element: <Signin /> },

      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        ),
      },

      {
        path: "/review-request",
        element: (
          <PrivateRoute>
            <ReviewRequest />
          </PrivateRoute>
        ),
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/update-password",
        element: <UpdatePassword />,
      },
    ],
  },
]);
