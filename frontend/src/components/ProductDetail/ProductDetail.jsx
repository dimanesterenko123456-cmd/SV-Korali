import css from "./ProductDetail.module.css";

const ProductDetail = ({ product }) => {
  const name = product?.name || "Без назви";
  const category = product?.category || "";
  const inStock =
    product?.inStock ?? (product?.countInStock > 0 ? true : false);

  return (
    <div className={css.info}>
      <h3 className={css.name} title={name}>
        {name}
      </h3>

      <div className={css.meta}>
        {category && <span className={css.category}>{category}</span>}

        <span className={`${css.stock} ${inStock ? css.ok : css.no}`}>
          {inStock ? "В наявності" : "Немає"}
        </span>
      </div>
    </div>
  );
};

export default ProductDetail;
