import { Link } from "react-router-dom";
import css from "./CheckoutSuccess.module.css";

const CheckoutSuccess = () => {
  return (
    <section className={css.section}>
      <div className={css.card}>
        <h1 className={css.title}>Payment successful</h1>
        <p className={css.subtitle}>
          Thank you for your purchase! A confirmation has been sent to your
          email.
        </p>

        <div className={css.actions}>
          <Link to="/catalog" className={css.buttonSecondary}>
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSuccess;
