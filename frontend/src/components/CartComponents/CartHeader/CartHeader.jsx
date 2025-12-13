import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import css from "./CartHeader.module.css";

const CartHeader = ({ count = 0 }) => {
  const navigate = useNavigate();

  return (
    <section className={css.header}>
      <div className={css.container}>
        <div className={css.row}>
          <button
            type="button"
            className={css.back}
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <FiArrowLeft />
          </button>

          <h1 className={css.title}>Shopping Cart</h1>

          <span className={css.badge}>
            {count} {count === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </section>
  );
};

export default CartHeader;
