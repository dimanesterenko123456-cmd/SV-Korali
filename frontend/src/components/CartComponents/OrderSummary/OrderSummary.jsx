import { FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal } from "react-icons/fa";
import { FiShield, FiTruck } from "react-icons/fi";
import css from "./OrderSummary.module.css";

const money2 = (v) => {
  const n = Number(v);
  const safe = Number.isFinite(n) ? n : 0;
  return `$${safe.toFixed(2)}`;
};

const OrderSummary = ({
  subtotal = 0,
  tax = 0,
  total = 0,
  promo = "",
  onPromoChange,
  onApplyPromo,
  onCheckout,
  isProcessing = false,
  errorMessage = "",
}) => {
  return (
    <div className={css.card}>
      <h2 className={css.title}>Order Summary</h2>

      <div className={css.rows}>
        <div className={css.row}>
          <span className={css.label}>Subtotal</span>
          <span className={css.value}>{money2(subtotal)}</span>
        </div>

        <div className={css.row}>
          <span className={css.label}>Shipping</span>
          <span className={css.free}>Free</span>
        </div>

        <div className={css.row}>
          <span className={css.label}>Tax</span>
          <span className={css.value}>{money2(tax)}</span>
        </div>

        <div className={css.divider} />

        <div className={css.totalRow}>
          <span className={css.totalLabel}>Total</span>
          <span className={css.totalValue}>{money2(total)}</span>
        </div>
      </div>

      <div className={css.promo}>
        <label className={css.promoLabel}>Promo Code</label>
        <div className={css.promoRow}>
          <input
            className={css.input}
            value={promo}
            onChange={(e) => onPromoChange?.(e.target.value)}
            placeholder="Enter code"
            type="text"
          />
          <button type="button" className={css.apply} onClick={onApplyPromo}>
            Apply
          </button>
        </div>
      </div>

      <button
        type="button"
        className={css.checkout}
        onClick={onCheckout}
        disabled={isProcessing}
      >
        {isProcessing ? "Redirecting..." : "Proceed to Checkout"}
      </button>
      {errorMessage ? <p className={css.error}>{errorMessage}</p> : null}
      <div className={css.flags}>
        <div className={css.flag}>
          <FiShield className={css.green} />
          <span>Secure Checkout</span>
        </div>
        <div className={css.flag}>
          <FiTruck className={css.blue} />
          <span>Free Shipping</span>
        </div>
      </div>

      <div className={css.payments}>
        <p className={css.payText}>We accept:</p>

        <div className={css.payRow}>
          <span className={css.payBox}>
            <FaCcVisa />
          </span>
          <span className={css.payBox}>
            <FaCcMastercard />
          </span>
          <span className={css.payBox}>
            <FaCcAmex />
          </span>
          <span className={css.payBox}>
            <FaPaypal />
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
