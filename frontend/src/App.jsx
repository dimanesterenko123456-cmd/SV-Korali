import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
const WelcomePage = lazy(() => import("./pages/WelcomePage/WelcomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage/AuthPage"));
const OrderPage = lazy(() => import("./pages/OrderPage/OrderPage"));

const CatalogPage = lazy(() => import("./pages/CatalogPage/CatalogPage"));
const AboutPage = lazy(() => import("./pages/AboutPage/AboutPage"));

const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout/AdminLayout"));
const AdminDashboardPage = lazy(() =>
  import("./pages/Admin/AdminDashboardPage/AdminDashboardPage")
);
const AdminProductsPage = lazy(() =>
  import("./pages/Admin/AdminProductsPage/AdminProductsPage")
);

const AddProductPage = lazy(() =>
  import("./pages/Admin/AddProductPage/AddProductPage")
);
const AdminProductUpdatePage = lazy(() =>
  import("./pages/Admin/AdminProductUpdatePage/AdminProductUpdatePage")
);

const CheckoutSuccess = lazy(() =>
  import("./pages/CheckoutSuccess/CheckoutSuccess")
);
const ProductDetailsPage = lazy(() =>
  import("./pages/ProductDetailsPage/ProductDetailsPage")
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
import NotFoundPage from "./routes/NotFoundPage/NotFoundPage";
import AdminRoute from "./routes/AdminRoute/AdminRoute";

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
        {/* ===== ПУБЛІЧНА ЧАСТИНА ЗІ ЗВИЧАЙНИМ LAYOUT ===== */}
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/:productId" element={<ProductDetailsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="checkout/success" element={<CheckoutSuccess />} />

          {/* приватні сторінки для звичайного юзера */}
          <Route element={<PrivateRoute redirectTo="/auth/login" />}>
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<OrderPage />} />
          </Route>

          {/* auth тільки для гостей */}
          <Route element={<RestrictedRoute redirectTo="/" />}>
            <Route path="auth/:authType" element={<AuthPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ===== ОКРЕМА АДМІН-ЗОНА ===== */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute redirectTo="/auth/login">
              <AdminRoute redirectTo="/">
                <AdminLayout />
              </AdminRoute>
            </PrivateRoute>
          }
        >
          {/* /admin */}
          <Route index element={<AdminDashboardPage />} />

          {/* /admin/products */}
          <Route path="products" element={<AdminProductsPage />} />

          {/* /admin/products/new – створення товару (твій AddProductPage всередині адмін-лейаута) */}
          <Route path="products/new" element={<AddProductPage />} />

          {/* /admin/products/:productId – сторінка update з того html-макету */}
          <Route
            path="products/:productId"
            element={<AdminProductUpdatePage />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
