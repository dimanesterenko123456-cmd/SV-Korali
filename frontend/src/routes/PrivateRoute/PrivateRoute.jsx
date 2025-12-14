// src/routes/PrivateRoute/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import {
  selectAuthRefreshing,
  selectIsLoggedIn,
} from "../../redux/selectors/authSelectors";
import Loader from "../../components/Loader/Loader";

const PrivateRoute = ({ redirectTo = "/auth/login", children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectAuthRefreshing);

  if (isRefreshing) {
    return <Loader />;
  }

  if (!isLoggedIn && !isRefreshing) {
    return <Navigate to={redirectTo} replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};

export default PrivateRoute;
