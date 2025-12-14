import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import css from "./CartPage.module.css";
import CartHeader from "../../components/CartComponents/CartHeader/CartHeader";
import CartItems from "../../components/CartComponents/CartItems/CartItems";
import OrderSummary from "../../components/CartComponents/OrderSummary/OrderSummary";
import Recommended from "../../components/CartComponents/Recommendation/Recommended";

// ✅ helpers
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const qtyOf = (item) => item?.quantity ?? item?.qty ?? item?.count ?? 1;

const CartPage = () => {
  const dispatch = useDispatch();

  /**
   * ✅ ТУТ ЄДИНЕ МІСЦЕ, ДЕ ТИ ПІДКЛЮЧАЄШ СВОЇ СЕЛЕКТОРИ
   * Заміняй на твої:
   *  - selectCartItems
   *  - selectCartCount
   *  - selectRecommendedProducts (опційно)
   */
  const items =
    useSelector((state) => state.cart?.items || state.cart?.cartItems || []) ||
    [];
  const itemsCount =
    useSelector((state) => state.cart?.count || state.cart?.itemsCount) ??
    items.length;

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
  const onIncrease = (id) => {
    // dispatch(cartIncrease(id));
    console.log("increase", id);
  };

  const onDecrease = (id) => {
    // dispatch(cartDecrease(id));
    console.log("decrease", id);
  };

  const onRemove = (id) => {
    // dispatch(cartRemove(id));
    console.log("remove", id);
  };

  const onClear = () => {
    // dispatch(cartClear());
    console.log("clear");
  };

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
