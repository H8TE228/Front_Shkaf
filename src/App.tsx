import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components";
import { ErrorPage, HomePage, LoginPage, RegisterPage } from "@/pages";

function App() {
  const router = createBrowserRouter([
    {
      Component: Layout,
      children: [
        { path: "/", Component: HomePage },
        { path: "/login", Component: LoginPage },
        { path: "/register", Component: RegisterPage },
        {
          path: "*",
          Component: ErrorPage,
        },

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
