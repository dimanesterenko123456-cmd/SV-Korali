import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
const WelcomePage = lazy(() => import("./pages/WelcomePage/WelcomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage/AuthPage"));
const OrderPage = lazy(() => import("./pages/OrderPage/OrderPage"));
const AddProductPage = lazy(() =>
  import("./pages/AddProductPage/AddProductPage")
);
import "./App.css";
import RestrictedRoute from "./routes/RestrictedRoute/RestrictedRoute";
import PrivateRoute from "./routes/PrivateRoute/PrivateRoute";
import CartPage from "./pages/CartPage/CartPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchCurrentUserThunk,
  refreshUserThunk,
} from "./redux/operations/authOperations";
import Loader from "./components/Loader/Loader";
import { selectAuthRefreshing } from "./redux/selectors/authSelectors";

function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectAuthRefreshing);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(refreshUserThunk()).unwrap();

        await dispatch(fetchCurrentUserThunk()).unwrap();
      } catch (e) {
        console.error("Error during auth initialization:", e);
      }
    };

    initAuth();
  }, [dispatch]);

  if (isRefreshing) {
    return <Loader />;
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />

          <Route element={<RestrictedRoute redirectTo="/" />}>
            <Route path="auth/:authType" element={<AuthPage />} />

            <Route element={<PrivateRoute redirectTo="/auth/login" />}>
              <Route path="cart" element={<CartPage />} />
              <Route path="orders" element={<OrderPage />} />
            </Route>
          </Route>
          <Route path="admin/add-product" element={<AddProductPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
