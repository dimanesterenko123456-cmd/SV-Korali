import { Link } from "react-router-dom";
import css from "./CartItems.module.css";
import CartItemCard from "../CartItemCard/CartItemCard";

const CartItems = ({
  items = [],
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
}) => {
  return (
    <div className={css.wrap}>
      <div className={css.list}>
        {!items.length && (
          <div className={css.empty}>
            Cart is empty.{" "}
            <Link className={css.emptyLink} to="/catalog">
              Continue shopping →
            </Link>
          </div>
        )}

        {items.map((item) => (
          <CartItemCard
            key={item?._id || item?.id || item?.productId}
            item={item}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className={css.footer}>
        <Link to="/catalog" className={css.continue}>
          ← Continue Shopping
        </Link>

        <button type="button" className={css.clear} onClick={onClear}>
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartItems;
