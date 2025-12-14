import { FiDownload, FiPlus } from "react-icons/fi";
import css from "./AdminProductsHeader.module.css";

const AdminProductsHeader = ({ onAddProduct }) => {
  return (
    <header className={css.header}>
      <div className={css.titles}>
        <h1 className={css.title}>Products</h1>
        <p className={css.subtitle}>Manage your product inventory</p>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={`${css.button} ${css.buttonPrimary}`}
          onClick={onAddProduct}
        >
          <FiPlus className={css.icon} />
          <span>Add product</span>
        </button>
      </div>
    </header>
  );
};

export default AdminProductsHeader;
