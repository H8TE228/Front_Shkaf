import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout, ProtectedRoute, PublicRoute } from "@/components";
import {
  CatalogPage,
  ErrorPage,
  HomePage,
  ItemPage,
  LoginPage,
  ProfilePage,
  RegisterPage,
  ArticlesPage,
  PointsPage,
  FavoritesPage,
  ChatsPage,
  PointPage,
  UserProfilePage,
  ExchangeReviewPage,
  MyItemsPage,
} from "@/pages";
import { useMe } from "./hooks";

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { path: "/", Component: HomePage },
      { path: "/catalog", Component: CatalogPage },
      { path: "/item/:id", Component: ItemPage },
      { path: "/articles", Component: ArticlesPage },
      { path: "/points", Component: PointsPage },
      { path: "/points/:id", Component: PointPage },
      { path: "/users/:id", Component: UserProfilePage },
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
          {
            path: "/favorites",
            Component: FavoritesPage,
          },
          { path: "/chats", Component: ChatsPage },
          { path: "/my-items", Component: MyItemsPage },
          {
            path: "/users/:id/review/:exchangeId",
            Component: ExchangeReviewPage,
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
