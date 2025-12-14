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

  // масив сторінок 1..totalPages
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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
          className={css.pageArrow}
          onClick={handlePrev}
          disabled={!hasPrev}
        >
          «
        </button>

        <div className={css.pageNumbers}>
          {pages.map((p) => {
            const isActive = p === page;
            return (
              <button
                key={p}
                type="button"
                className={`${css.pageNumber} ${
                  isActive ? css.pageNumberActive : ""
                }`}
                onClick={() => onPageChange(p)}
                disabled={isActive}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={css.pageArrow}
          onClick={handleNext}
          disabled={!hasNext}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default CatalogProducts;
