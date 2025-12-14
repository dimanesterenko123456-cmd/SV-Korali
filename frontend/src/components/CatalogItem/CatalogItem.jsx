import ProductDetail from "../ProductDetail/ProductDetail";
import css from "./CatalogItem.module.css";

const CatalogItem = ({ product }) => {
  const mainImage =
    product?.image ||
    (Array.isArray(product?.images) && product.images.length > 0
      ? product.images[0]
      : "");

  const rawPrice = product?.price;
  const numPrice = Number(rawPrice);
  const price =
    rawPrice != null && rawPrice !== ""
      ? Number.isFinite(numPrice)
        ? `$${numPrice}`
        : `$${rawPrice}`
      : "—";

  const ratingValue = Number(
    product?.rating ?? product?.avgRating ?? product?.averageRating ?? 0
  );
  const showRating = Number.isFinite(ratingValue) && ratingValue > 0;

  const rounded = Math.round(ratingValue);

  return (
    <li className={css.card}>
      <div className={css.imageWrap}>
        <button
          type="button"
          className={css.wishBtn}
          aria-label="Add to wishlist"
        >
          <svg
            className={css.wishIcon}
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path
              d="M12 21s-7.2-4.6-9.6-8.6C.5 9 2.3 5.8 5.7 5.2c1.9-.3 3.7.5 4.7 2 1-1.5 2.8-2.3 4.7-2 3.4.6 5.2 3.8 3.3 7.2C19.2 16.4 12 21 12 21z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {mainImage ? (
          <img
            src={mainImage}
            alt={product?.name || "product"}
            className={css.image}
            loading="lazy"
          />
        ) : (
          <div className={css.imagePlaceholder} />
        )}
      </div>

      <div className={css.content}>
        <ProductDetail product={product} />

        <div className={css.metaRow}>
          <span className={css.price}>{price}</span>

          {showRating && (
            <span className={css.rating} aria-label={`Rating ${ratingValue}`}>
              <span className={css.stars} aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`${css.star} ${i < rounded ? css.starOn : ""}`}
                  >
                    ★
                  </span>
                ))}
              </span>
              <span className={css.ratingValue}>{ratingValue.toFixed(1)}</span>
            </span>
          )}
        </div>

        <button type="button" className={css.cartBtn}>
          Add to Cart
        </button>
      </div>
    </li>
  );
};

export default CatalogItem;
