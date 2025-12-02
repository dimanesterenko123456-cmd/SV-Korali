import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import {
  selectIsLoggedIn,
  selectAuthRefreshing,
} from "../redux/selectors/authSelectors";
import Loader from "../components/Loader/Loader";

const RestrictedRoute = ({ redirectTo = "/" }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectAuthRefreshing);

  if (isRefreshing) {
    return <Loader />;
  }

  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default RestrictedRoute;
