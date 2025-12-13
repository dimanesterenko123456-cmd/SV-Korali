import { FiGrid, FiList } from "react-icons/fi";
import SearchBox from "../../SearchBox/SearchBox";
import css from "./CatalogToolbar.module.css";

const CatalogToolbar = ({
  totalCount = 0,
  sort,
  onSortChange,

  onSearchChange,
  onSearchSubmit,
}) => {
  return (
    <div className={css.toolbar}>
      <p className={css.showing}>
        Showing <span className={css.count}>{totalCount}</span> products
      </p>

      <div className={css.controls}>
        <select className={css.select} value={sort} onChange={onSortChange}>
          <option value="popular">Sort by: Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>

        <div className={css.searchWrap}>
          <SearchBox onChange={onSearchChange} onSubmit={onSearchSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CatalogToolbar;
