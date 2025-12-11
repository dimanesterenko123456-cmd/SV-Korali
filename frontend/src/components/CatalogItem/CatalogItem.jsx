// src/components/CatalogItem/CatalogItem.jsx
import ProductDetail from "../ProductDetail/ProductDetail";
import css from "./CatalogItem.module.css";

const CatalogItem = ({ product }) => {
  const mainImage =
    product?.image ||
    (Array.isArray(product?.images) && product.images.length > 0
      ? product.images[0]
      : "");

  const price =
    product?.price != null && product.price !== "" ? `${product.price} $` : "—";

  return (
    <li className={css.card}>
      <div className={css.imageWrap}>
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

        <div className={css.actions}>
          <span className={css.price}>{price}</span>
          <button type="button" className={css.cartBtn}>
            Cart
          </button>
        </div>
      </div>
    </li>
  );
};

export default CatalogItem;
