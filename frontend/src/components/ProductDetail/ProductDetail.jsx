import css from "./ProductDetail.module.css";

const ProductDetail = ({ product }) => {
  const name = product?.name || "Без назви";
  const category = product?.category || "";
  const inStock =
    product?.inStock ?? (product?.countInStock > 0 ? true : false);

  const categoryText = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "";

  return (
    <div className={css.info}>
      <h3 className={css.name} title={name}>
        {name}
      </h3>

      {categoryText && <p className={css.category}>{categoryText}</p>}

      {!inStock && <span className={css.outOfStock}>Немає</span>}
    </div>
  );
};

export default ProductDetail;
