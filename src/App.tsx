import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components";
import { ErrorPage, HomePage, LoginPage } from "@/pages";

function App() {
  const router = createBrowserRouter([
    {
      Component: Layout,
      children: [
        { path: "/", Component: HomePage },
        { path: "/login", Component: LoginPage },
        {
          path: "*",
          Component: ErrorPage,
        },
        // { path: "/register", Component: RegisterPage },

        // {
        //   element: <PublicRoute />,
        //   children: [
        //     {
        //       path: "/admin/login",
        //       Component: AdminLoginPage,
        //     },
        //     {
        //       path: "/login",
        //       Component: LoginPage,
        //     },
        //   ],
        // },

        // {
        //   element: <ProtectedRoute />,
        //   children: [
        //     {
        //       path: "/admin",
        //       Component: AdminPage,
        //     },
        //   ],
        // },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
