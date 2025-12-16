import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import css from "./CartPage.module.css";
import CartHeader from "../../components/CartComponents/CartHeader/CartHeader";
import CartItems from "../../components/CartComponents/CartItems/CartItems";
import OrderSummary from "../../components/CartComponents/OrderSummary/OrderSummary";
import Recommended from "../../components/CartComponents/Recommendation/Recommended";

import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice";
import {
  selectCartCount,
  selectCartItems,
} from "../../redux/selectors/cartSelectors";

// ✅ helpers
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const qtyOf = (item) => item?.quantity ?? item?.qty ?? item?.count ?? 1;

const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const itemsCount = useSelector(selectCartCount);

  // recommended: можеш замінити на свої дані
  const recommended =
    useSelector((state) => state.products?.items || state.products?.products) ||
    [];

  // ✅ totals як в HTML: Subtotal + Tax (10%) + Shipping Free :contentReference[oaicite:1]{index=1}
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + toNumber(item?.price) * qtyOf(item);
    }, 0);
  }, [items]);

  const shipping = 0;
  const tax = useMemo(() => subtotal * 0.1, [subtotal]);
  const total = subtotal + shipping + tax;

  // promo
  const [promo, setPromo] = useState("");

  /**
   * ✅ ТУТ ЄДИНЕ МІСЦЕ, ДЕ ТИ ПІДКЛЮЧАЄШ СВОЮ ЛОГІКУ/ACTIONS
   * Підстав dispatch(...) на свої thunks/actions:
   * - cartIncrease(id)
   * - cartDecrease(id)
   * - cartRemove(id)
   * - cartClear()
   */
  const onIncrease = (id) => dispatch(increaseQuantity(id));

  const onDecrease = (id) => dispatch(decreaseQuantity(id));

  const onRemove = (id) => dispatch(removeFromCart(id));

  const onClear = () => dispatch(clearCart());

  const onApplyPromo = () => {
    console.log("apply promo", promo);
  };

  const onCheckout = () => {
    console.log("checkout");
  };

  return (
    <section className={css.page}>
      <CartHeader count={itemsCount} />

      <div className={css.container}>
        <div className={css.grid}>
          <div className={css.left}>
            <CartItems
              items={items}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onRemove={onRemove}
              onClear={onClear}
            />
          </div>

          <aside className={css.right}>
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              promo={promo}
              onPromoChange={setPromo}
              onApplyPromo={onApplyPromo}
              onCheckout={onCheckout}
            />
          </aside>
        </div>
      </div>

      <Recommended products={recommended?.slice?.(0, 3) || []} />
    </section>
  );
};

export default CartPage;
