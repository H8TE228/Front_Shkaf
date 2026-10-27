// import { useMe } from "@/hooks";
// import { Navigate, Outlet, useLocation } from "react-router-dom";

// export const ProtectedRoute = () => {
//   const location = useLocation();
//   const { data: isAuth, isLoading, isError } = useMe();

//   if (isLoading) return <>Загрузка...</>; // надпись показывается ток на защищенном роуте

//   if (!isAuth || isError) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return <Outlet />;
// };
