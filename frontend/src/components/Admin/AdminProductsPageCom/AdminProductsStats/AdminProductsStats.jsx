import {
  FiBox,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
} from "react-icons/fi";
import css from "./AdminProductsStats.module.css";

const AdminProductsStats = ({ products = [], totalCount = 0 }) => {
  const total = totalCount || products.length;

  let inStock = 0;
  let lowStock = 0;
  let outOfStock = 0;

  products.forEach((p) => {
    const count =
      typeof p.countInStock === "number"
        ? p.countInStock
        : typeof p.stock === "number"
        ? p.stock
        : 0;

    if (count <= 0) {
      outOfStock += 1;
    } else if (count <= 5) {
      lowStock += 1;
    } else {
      inStock += 1;
    }
  });

  return (
    <div className={css.grid}>
      <div className={css.card}>
        <div className={css.cardHeader}>
          <div>
            <p className={css.label}>Total products</p>
            <p className={css.value}>{total}</p>
          </div>
          <div className={`${css.iconWrap} ${css.iconCoral}`}>
            <FiBox />
          </div>
        </div>
        <p className={css.trend}>+0% vs last month</p>
      </div>

      <div className={css.card}>
        <div className={css.cardHeader}>
          <div>
            <p className={css.label}>In stock</p>
            <p className={css.value}>{inStock}</p>
          </div>
          <div className={`${css.iconWrap} ${css.iconGreen}`}>
            <FiCheckCircle />
          </div>
        </div>
        <p className={css.trend}>healthy inventory</p>
      </div>

      <div className={css.card}>
        <div className={css.cardHeader}>
          <div>
            <p className={css.label}>Low stock</p>
            <p className={css.value}>{lowStock}</p>
          </div>
          <div className={`${css.iconWrap} ${css.iconYellow}`}>
            <FiAlertTriangle />
          </div>
        </div>
        <p className={css.trend}>needs attention</p>
      </div>

      <div className={css.card}>
        <div className={css.cardHeader}>
          <div>
            <p className={css.label}>Out of stock</p>
            <p className={css.value}>{outOfStock}</p>
          </div>
          <div className={`${css.iconWrap} ${css.iconRed}`}>
            <FiXCircle />
          </div>
        </div>
        <p className={css.trend}>restock required</p>
      </div>
    </div>
  );
};

export default AdminProductsStats;
