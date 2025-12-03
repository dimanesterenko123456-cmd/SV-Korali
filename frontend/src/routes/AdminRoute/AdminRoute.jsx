import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import {
  selectAuthRefreshing,
  selectIsLoggedIn,
  selectUserRole,
} from "../../redux/selectors/authSelectors";
import Loader from "../../components/Loader/Loader";

const AdminRoute = ({ redirectTo = "/" }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectAuthRefreshing);
  const role = useSelector(selectUserRole);

  if (isRefreshing) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  if (role !== "admin") {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
