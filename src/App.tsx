import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components";

function App() {
  const router = createBrowserRouter([
    {
      Component: Layout,
      children: [
        { path: "/", element: <div>Главная</div> },

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
