import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "@/pages/Login";
import Practice from "@/pages/Practice";
import Profile from "@/pages/Profile";
import ProtectedRoute from "@/routes/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { path: "/practice", element: <Practice /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
  { path: "*", element: <Login /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
