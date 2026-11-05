import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout, ProtectedRoute, PublicRoute } from "@/components";
import {
  ErrorPage,
  HomePage,
  LoginPage,
  ProfilePage,
  RegisterPage,
} from "@/pages";
import { useMe } from "./hooks";

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { path: "/", Component: HomePage },
      { path: "*", Component: ErrorPage },
      {
        element: <PublicRoute />,
        children: [
          { path: "/login", Component: LoginPage },
          { path: "/register", Component: RegisterPage },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/profile",
            Component: ProfilePage,
          },
        ],
      },
    ],
  },
]);

function App() {
  console.log("Первый вызов useMe");
  const { data: user } = useMe();

  if (user) {
    console.log(
      `Данные авторизованного пользователя: id: ${user.id}, username: ${user.username}`,
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
