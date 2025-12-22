import { FaBars, FaBell, FaQuestionCircle } from "react-icons/fa";
import css from "./AdminTopBar.module.css";

const AdminTopbar = () => {
  return (
    <header id="admin-header" className={css.header}>
      <div className={css.left}>
        <button type="button" className={css.iconBtn} aria-label="Toggle menu">
          <FaBars />
        </button>
        <div className={css.titles}>
          <h1 className={css.title}>Admin panel</h1>
          <p className={css.subtitle}>Manage products, orders and content</p>
        </div>
      </div>

      <div className={css.right}>
        <button
          type="button"
          className={css.iconBtn}
          aria-label="Notifications"
        >
          <FaBell />
        </button>
        <button type="button" className={css.iconBtn} aria-label="Help">
          <FaQuestionCircle />
        </button>
        <a className={css.breadcrumbLink} href="/">
          Home
        </a>{" "}
      </div>
    </header>
  );
};

export default AdminTopbar;
