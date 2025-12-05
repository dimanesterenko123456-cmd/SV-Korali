import css from "./CatalogProduct.module.css";
import CatalogItem from "../CatalogItem/CatalogItem";
const CatalogProducts = ({ products = [], pagination, onPageChange }) => {
  const { page, totalPages, hasPrev, hasNext } = pagination || {};

  const handlePrev = () => {
    if (!hasPrev) return;
    onPageChange(page - 1);
  };

  const handleNext = () => {
    if (!hasNext) return;
    onPageChange(page + 1);
  };

  if (!products.length) {
    return <p className={css.empty}>Товари не знайдено.</p>;
  }

  return (
    <div className={css.wrapper}>
      <ul className={css.list}>
        {products.map((product) => (
          <CatalogItem key={product._id} product={product} />
        ))}
      </ul>

      <div className={css.pagination}>
        <button
          type="button"
          className={css.pageBtn}
          onClick={handlePrev}
          disabled={!hasPrev}
        >
          Назад
        </button>

        <span className={css.pageInfo}>
          {page} / {totalPages}
        </span>

        <button
          type="button"
          className={css.pageBtn}
          onClick={handleNext}
          disabled={!hasNext}
        >
          Далі
        </button>
      </div>
    </div>
  );
};

export default CatalogProducts;
