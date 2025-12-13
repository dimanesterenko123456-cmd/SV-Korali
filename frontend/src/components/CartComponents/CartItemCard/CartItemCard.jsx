import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import css from "./CartItemCard.module.css";

const getMainImage = (item) =>
  item?.image ||
  (Array.isArray(item?.images) && item.images.length ? item.images[0] : "");

const qtyOf = (item) => item?.quantity ?? item?.qty ?? item?.count ?? 1;

const money = (v) => {
  const n = Number(v);
  const safe = Number.isFinite(n) ? n : 0;
  return `$${safe.toFixed(0)}`; // в HTML без копійок :contentReference[oaicite:2]{index=2}
};

const CartItemCard = ({ item, onIncrease, onDecrease, onRemove }) => {
  const id = item?._id || item?.id || item?.productId;
  const img = getMainImage(item);
  const qty = qtyOf(item);

  const name = item?.name || "Product";
  const collection = item?.collection || item?.category || "Collection";
  const sku = item?.sku || (id ? String(id).slice(0, 8).toUpperCase() : "—");

  return (
    <div className={css.card}>
      <div className={css.row}>
        <div className={css.imgWrap}>
          {img ? (
            <img className={css.img} src={img} alt={name} loading="lazy" />
          ) : (
            <div className={css.imgPh} />
          )}
        </div>

        <div className={css.body}>
          <div className={css.top}>
            <div>
              <h3 className={css.title}>{name}</h3>
              <p className={css.sub}>{collection}</p>
              <p className={css.sku}>SKU: {sku}</p>
            </div>

            <button
              type="button"
              className={css.trash}
              onClick={() => onRemove?.(id)}
              aria-label="Remove"
              title="Remove"
            >
              <FiTrash2 />
            </button>
          </div>

          <div className={css.bottom}>
            <div className={css.qty}>
              <span className={css.qtyLabel}>Quantity:</span>

              <div className={css.qtyBox}>
                <button
                  type="button"
                  className={css.qtyBtn}
                  onClick={() => onDecrease?.(id)}
                  aria-label="Decrease"
                >
                  <FiMinus />
                </button>

                <span className={css.qtyValue}>{qty}</span>

                <button
                  type="button"
                  className={css.qtyBtn}
                  onClick={() => onIncrease?.(id)}
                  aria-label="Increase"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className={css.price}>{money(item?.price)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
