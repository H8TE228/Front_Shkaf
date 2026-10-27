// import { useMe } from "@/hooks";
// import { Navigate, Outlet, useLocation } from "react-router-dom";

// export const PublicRoute = () => {
//   const location = useLocation();
//   const { data: isAuth, isError } = useMe();

//   // const isAuth = queryClient.getQueryData(["me"]);

//   if (isAuth && !isError) {
//     const from = location.state?.from?.pathname || "/";

//     return <Navigate to={from} replace />;
//   }

//   return <Outlet />;
// };
