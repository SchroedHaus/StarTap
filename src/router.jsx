import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import PrivateRoute from "./components/PrivateRoute";
import UserProfile from "./components/UserProfile";
import ReviewRequest from "./components/ReviewRequest";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Signup /> },
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
    ],
  },
]);
