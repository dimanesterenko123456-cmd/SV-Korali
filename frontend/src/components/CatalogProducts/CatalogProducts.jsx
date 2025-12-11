// src/components/CatalogProducts/CatalogProducts.jsx
import CatalogItem from "../CatalogItem/CatalogItem";
import css from "./CatalogProduct.module.css";

const CatalogProducts = ({
  products = [],
  pagination,
  onPageChange,
  variant = "list",
}) => {
  const {
    page = 1,
    totalPages = 1,
    hasPrev = false,
    hasNext = false,
  } = pagination || {};

  const handlePrev = () => {
    if (!hasPrev) return;
    onPageChange(page - 1);
  };

  const handleNext = () => {
    if (!hasNext) return;
    onPageChange(page + 1);
  };

  if (!products.length) {
    return <p className={css.empty}>No products found.</p>;
  }

  const isWelcome = variant === "welcome";

  return (
    <div className={isWelcome ? css.panelWelcome : css.panelDefault}>
      <ul className={isWelcome ? css.grid : css.list}>
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
          Prev
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
          Next
        </button>
      </div>
    </div>
  );
};

export default CatalogProducts;
