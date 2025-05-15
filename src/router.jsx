import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import UserProfile from "./components/UserProfile";
import ReviewRequest from "./components/ReviewRequest";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  { path: "/dashboard", element: <PrivateRoute><Dashboard /></PrivateRoute>},
  { path: "/profile", element: <PrivateRoute><UserProfile /></PrivateRoute>},
  { path: "/review-request", element: <PrivateRoute><ReviewRequest /></PrivateRoute>},
]);
