import css from "./BurgerMenu.module.css";

const BurgerMenu = ({ onClick }) => {
  return (
    <button
      type="button"
      className={css.button}
      onClick={onClick}
      aria-label="Open menu"
    >
      <span className={css.lines}>
        <span />
        <span />
        <span />
      </span>
    </button>
  );
};

export default BurgerMenu;
