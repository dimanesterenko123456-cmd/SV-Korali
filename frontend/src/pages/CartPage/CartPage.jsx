import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import css from "./CartPage.module.css";
import CartHeader from "../../components/CartComponents/CartHeader/CartHeader";
import CartItems from "../../components/CartComponents/CartItems/CartItems";
import OrderSummary from "../../components/CartComponents/OrderSummary/OrderSummary";
import Recommended from "../../components/CartComponents/Recommendation/Recommended";
import { createCheckoutSession } from "../../services/payments";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const onIncrease = (id) => dispatch(increaseQuantity(id));

  const onDecrease = (id) => dispatch(decreaseQuantity(id));

  const onRemove = (id) => dispatch(removeFromCart(id));

  const onClear = () => dispatch(clearCart());

  const onApplyPromo = () => {
    console.log("apply promo", promo);
  };

  const onCheckout = async () => {
    if (isProcessing) return;

    setCheckoutError("");

    if (!items.length) {
      setCheckoutError("Ваш кошик порожній.");
      return;
    }

    setIsProcessing(true);

    try {
      const session = await createCheckoutSession(items);

      if (session?.url) {
        window.location.href = session.url;
        return;
      }

      setCheckoutError("Не вдалося розпочати оплату. Спробуйте ще раз.");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Не вдалося створити сесію оплати.";

      setCheckoutError(message);
    } finally {
      setIsProcessing(false);
    }
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
              isProcessing={isProcessing}
              errorMessage={checkoutError}
            />
          </aside>
        </div>
      </div>

      <Recommended products={recommended?.slice?.(0, 3) || []} />
    </section>
  );
};

export default CartPage;
