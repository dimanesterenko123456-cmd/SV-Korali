import css from "./CatalogFilters.module.css";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const CatalogFilters = ({
  filtersDraft,
  onDraftChange,
  onApply,
  onClear,
  variant = "desktop",
  namePrefix = "filters",
  maxPriceLimit = 300,
}) => {
  const minLimit = 0;
  const maxLimit =
    Number.isFinite(maxPriceLimit) && maxPriceLimit > 0 ? maxPriceLimit : 300;

  const currentMax =
    filtersDraft.priceMax === null ? maxLimit : Number(filtersDraft.priceMax);

  const currentMin = clamp(
    Number(filtersDraft.priceMin ?? 0),
    minLimit,
    currentMax
  );

  const handleMinChange = (e) => {
    const nextMin = clamp(Number(e.target.value), minLimit, currentMax);
    onDraftChange("priceMin", nextMin);
  };

  const handleMaxChange = (e) => {
    const raw = clamp(Number(e.target.value), minLimit, maxLimit);

    // ✅ якщо користувач поставив на максимум — це "без обмеження"
    const nextMax = raw >= maxLimit ? null : raw;

    const nextMaxValue = nextMax === null ? maxLimit : nextMax;
    const nextMin = Math.min(currentMin, nextMaxValue);

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
              name={`${namePrefix}-category`}
              checked={filtersDraft.category === ""}
              onChange={() => onDraftChange("category", "")}
            />
            <span>All</span>
          </label>

          <label className={css.row}>
            <input
              type="radio"
              name={`${namePrefix}-category`}
              checked={filtersDraft.category === "necklace"}
              onChange={() => onDraftChange("category", "necklace")}
            />
            <span>Necklaces</span>
          </label>

          <label className={css.row}>
            <input
              type="radio"
              name={`${namePrefix}-category`}
              checked={filtersDraft.category === "bracelet"}
              onChange={() => onDraftChange("category", "bracelet")}
            />
            <span>Bracelets</span>
          </label>

          <label className={css.row}>
            <input
              type="radio"
              name={`${namePrefix}-category`}
              checked={filtersDraft.category === "earrings"}
              onChange={() => onDraftChange("category", "earrings")}
            />
            <span>Earrings</span>
          </label>

          <label className={css.row}>
            <input
              type="radio"
              name={`${namePrefix}-category`}
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
          <span className={css.rangeValue}>${currentMin}</span>
          <span className={css.rangeDash}>—</span>
          <span className={css.rangeValue}>${currentMax}</span>
        </div>

        <div className={css.rangeWrap}>
          <label className={css.rangeRow}>
            <span className={css.rangeLabel}>Min</span>
            <input
              className={css.range}
              type="range"
              min={minLimit}
              max={currentMax}
              step={5}
              value={currentMin}
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
              value={currentMax}
              onChange={handleMaxChange}
            />
          </label>
        </div>

        <p className={css.rangeHint}>Tip: move Max to the end for “Any”</p>
      </div>

      <div className={`${css.block} ${css.borderTop}`}>
        <p className={css.label}>Availability</p>

        <label className={css.row}>
          <input
            type="checkbox"
            checked={Boolean(filtersDraft.inStockOnly)}
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
