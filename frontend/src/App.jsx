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
import AdminRoute from "./routes/AdminRoute/AdminRoute";
import CartPage from "./pages/CartPage/CartPage";

function App() {
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

              <Route element={<AdminRoute redirectTo="/" />}>
                <Route path="admin/add-product" element={<AddProductPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
