import css from "./CatalogFilters.module.css";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const CatalogFilters = ({
  filtersDraft,
  onDraftChange,
  onApply,
  onClear,
  variant = "desktop",
}) => {
  const minLimit = 0;
  const maxLimit = 2000;

  const handleMinChange = (e) => {
    const nextMin = clamp(Number(e.target.value), minLimit, maxLimit);
    const nextMax = Math.max(nextMin, filtersDraft.priceMax);
    onDraftChange("priceMin", nextMin);
    onDraftChange("priceMax", nextMax);
  };

  const handleMaxChange = (e) => {
    const nextMax = clamp(Number(e.target.value), minLimit, maxLimit);
    const nextMin = Math.min(filtersDraft.priceMin, nextMax);
    onDraftChange("priceMin", nextMin);
    onDraftChange("priceMax", nextMax);
  };

  return (
    <div
      className={`${css.card} ${variant === "mobile" ? css.cardMobile : ""}`}
    >
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

        <div className={css.rangeHead}>
          <span className={css.rangeValue}>${filtersDraft.priceMin}</span>
          <span className={css.rangeDash}>—</span>
          <span className={css.rangeValue}>${filtersDraft.priceMax}</span>
        </div>

        <div className={css.rangeWrap}>
          <label className={css.rangeRow}>
            <span className={css.rangeLabel}>Min</span>
            <input
              className={css.range}
              type="range"
              min={minLimit}
              max={maxLimit}
              step={5}
              value={filtersDraft.priceMin}
              onChange={handleMinChange}
            />
          </label>

          <label className={css.rangeRow}>
            <span className={css.rangeLabel}>Max</span>
            <input
              className={css.range}
              type="range"
              min={minLimit}
              max={maxLimit}
              step={5}
              value={filtersDraft.priceMax}
              onChange={handleMaxChange}
            />
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
