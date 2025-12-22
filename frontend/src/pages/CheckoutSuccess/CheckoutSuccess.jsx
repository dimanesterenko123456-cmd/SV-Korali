import { Link, useLocation } from "react-router-dom";
import css from "./CheckoutSuccess.module.css";

const CheckoutSuccess = () => {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");

  return (
    <section className={css.section}>
      <div className={css.card}>
        <h1 className={css.title}>Payment successful</h1>
        <p className={css.subtitle}>
          Thank you for your purchase! A confirmation has been sent to your
          email.
        </p>

        {sessionId ? (
          <p className={css.helper}>Stripe session ID: {sessionId}</p>
        ) : null}

        <div className={css.actions}>
          <Link to="/orders" className={css.buttonPrimary}>
            View my orders
          </Link>
          <Link to="/catalog" className={css.buttonSecondary}>
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSuccess;
