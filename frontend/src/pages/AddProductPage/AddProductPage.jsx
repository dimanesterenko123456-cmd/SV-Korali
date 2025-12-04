// src/pages/AddProductPage/AddProductPage.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import css from "./AddProductPage.module.css";
import {
  selectAccessToken,
  selectAuthRefreshing,
  selectUserRole,
} from "../../redux/selectors/authSelectors";
import ProductCreateForm from "../../components/ProductCreateForm/ProductCreateForm";

const AddProductPage = () => {
  const accessToken = useSelector(selectAccessToken);
  const isRefreshing = useSelector(selectAuthRefreshing);
  const role = useSelector(selectUserRole);

  if (isRefreshing) {
    return <Loading />;
  }

  if (!accessToken) {
    return <Navigate to="/auth/login" />;
  }

  if (role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <section className={css.page}>
      <div className={css.card}>
        <header className={css.header}>
          <h1 className={css.title}>Додати товар</h1>
          <p className={css.subtitle}>
            Заповніть інформацію про товар та додайте фото, щоб опублікувати
            його в каталозі.
          </p>
        </header>

        <ProductCreateForm />
      </div>
    </section>
  );
};

export default AddProductPage;
