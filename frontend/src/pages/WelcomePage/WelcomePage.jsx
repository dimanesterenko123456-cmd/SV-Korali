import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../components/Loader/Loader";

import css from "./WelcomePage.module.css";
import {
  selectProducts,
  selectProductsError,
  selectProductsHasNext,
  selectProductsHasPrev,
  selectProductsLoading,
  selectProductsPage,
  selectProductsPerPage,
  selectProductsTotalPages,
} from "../../redux/selectors/productSelectors";
import { fetchProductsThunk } from "../../redux/operations/productOperations";
import CatalogProducts from "../../components/CatalogProducts/CatalogProducts";

const WelcomePage = () => {
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const page = useSelector(selectProductsPage);
  const perPage = useSelector(selectProductsPerPage);
  const totalPages = useSelector(selectProductsTotalPages);
  const hasNext = useSelector(selectProductsHasNext);
  const hasPrev = useSelector(selectProductsHasPrev);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    dispatch(fetchProductsThunk({ page, perPage }));
  }, [dispatch, page, perPage]);

  const handlePageChange = (nextPage) => {
    dispatch(fetchProductsThunk({ page: nextPage, perPage }));
  };

  return (
    <div className={css.container}>
      <div className={css.head}>
        <p className={css.subtitle}>Обирай, додавай у кошик, замовляй.</p>
      </div>

      {isLoading && (
        <div className={css.loaderWrap}>
          <Loader />
        </div>
      )}

      {!isLoading && error && (
        <div className={css.error}>
          {typeof error === "string" ? error : "Помилка завантаження товарів"}
        </div>
      )}

      {!isLoading && !error && (
        <CatalogProducts
          products={products}
          pagination={{
            page,
            perPage,
            totalPages,
            hasNext,
            hasPrev,
          }}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default WelcomePage;
