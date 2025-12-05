import ProductDetail from "../ProductDetail/ProductDetail";
import css from "./CatalogItem.module.css";

const CatalogItem = ({ product }) => {
  const mainImage =
    product?.image || (Array.isArray(product?.images) ? product.images[0] : "");

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

      <ProductDetail product={product} />

      <div className={css.actions}>
        <span className={css.price}>
          {product?.price != null ? `${product.price} ₴` : "—"}
        </span>

        <button type="button" className={css.addBtn}>
          В кошик
        </button>
      </div>
    </li>
  );
};

export default CatalogItem;
