import css from "./CartHeader.module.css";

const CartHeader = ({ count = 0 }) => {
  return (
    <section className={css.header}>
      <div className={css.container}>
        <div className={css.row}>
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
