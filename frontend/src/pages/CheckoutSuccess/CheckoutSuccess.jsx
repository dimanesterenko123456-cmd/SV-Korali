import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import css from "./CheckoutSuccess.module.css";

const CheckoutSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

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
