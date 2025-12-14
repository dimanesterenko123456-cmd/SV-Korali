import css from "./CatalogFilters.module.css";

const CatalogFilters = ({ filtersDraft, onDraftChange, onApply, onClear }) => {
  return (
    <div className={css.card}>
      <h3 className={css.title}>Filters</h3>

      <div className={css.block}>
        <p className={css.label}>Category</p>

        <div className={css.group}>
          <label className={css.row}>
            <input
              type="radio"
              name="category"
              checked={filtersDraft.category === ""}
              onChange={() => onDraftChange("category", "")}
            />
            <span>All</span>
          </label>

          <label className={css.row}>
            <input
              type="radio"
              name="category"
              checked={filtersDraft.category === "necklace"}
              onChange={() => onDraftChange("category", "necklace")}
            />
            <span>Necklaces</span>
          </label>

          <label className={css.row}>
            <input
              type="radio"
              name="category"
              checked={filtersDraft.category === "bracelet"}
              onChange={() => onDraftChange("category", "bracelet")}
            />
            <span>Bracelets</span>
          </label>

          <label className={css.row}>
            <input
              type="radio"
              name="category"
              checked={filtersDraft.category === "earrings"}
              onChange={() => onDraftChange("category", "earrings")}
            />
            <span>Earrings</span>
          </label>

          <label className={css.row}>
            <input
              type="radio"
              name="category"
              checked={filtersDraft.category === "other"}
              onChange={() => onDraftChange("category", "other")}
            />
            <span>Other</span>
          </label>
        </div>
      </div>

      <div className={`${css.block} ${css.borderTop}`}>
        <p className={css.label}>Price Range</p>

        <div className={css.group}>
          <label className={css.row}>
            <input
              type="radio"
              name="priceRange"
              checked={filtersDraft.priceRange === "any"}
              onChange={() => onDraftChange("priceRange", "any")}
            />
            <span>Any</span>
          </label>

          <label className={css.row}>
            <input
              type="radio"
              name="priceRange"
              checked={filtersDraft.priceRange === "under_50"}
              onChange={() => onDraftChange("priceRange", "under_50")}
            />
            <span>Under $50</span>
          </label>

          <label className={css.row}>
            <input
              type="radio"
              name="priceRange"
              checked={filtersDraft.priceRange === "50_150"}
              onChange={() => onDraftChange("priceRange", "50_150")}
            />
            <span>$50 – $150</span>
          </label>

          <label className={css.row}>
            <input
              type="radio"
              name="priceRange"
              checked={filtersDraft.priceRange === "over_150"}
              onChange={() => onDraftChange("priceRange", "over_150")}
            />
            <span>Over $150</span>
          </label>
        </div>
      </div>

      <div className={`${css.block} ${css.borderTop}`}>
        <p className={css.label}>Availability</p>

        <label className={css.row}>
          <input
            type="checkbox"
            checked={filtersDraft.inStockOnly}
            onChange={(e) => onDraftChange("inStockOnly", e.target.checked)}
          />
          <span>In stock only</span>
        </label>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.applyBtn} onClick={onApply}>
          Apply Filters
        </button>
        <button type="button" className={css.clearBtn} onClick={onClear}>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default CatalogFilters;
