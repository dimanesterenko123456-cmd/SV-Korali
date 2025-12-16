import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import Loader from "../../components/Loader/Loader";
import {
  selectAuthRefreshing,
  selectIsLoggedIn,
} from "../../redux/selectors/authSelectors";

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
