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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="add-product" element={<AddProductPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
