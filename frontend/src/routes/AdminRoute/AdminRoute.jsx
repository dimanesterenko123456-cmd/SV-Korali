// src/routes/AdminRoute/AdminRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectUserRole,
  selectIsLoggedIn,
  selectAuthRefreshing,
} from "../../redux/selectors/authSelectors";
import Loader from "../../components/Loader/Loader";

const AdminRoute = ({ redirectTo = "/", children }) => {
  const role = useSelector(selectUserRole);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectAuthRefreshing);

  if (isRefreshing) {
    return <Loader />;
  }

  if (!isLoggedIn || role !== "admin") {
    return <Navigate to={redirectTo} replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};

export default AdminRoute;
