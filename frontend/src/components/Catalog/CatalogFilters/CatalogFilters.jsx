import { useEffect, useState } from "react";
import css from "./CatalogFilters.module.css";

const MATERIAL_OPTIONS = [
  { value: "coral", label: "Coral" },
  { value: "seed-beads", label: "Seed beads" },
  { value: "glass", label: "Glass" },
  { value: "ceramic", label: "Ceramic" },
  { value: "natural-stone", label: "Natural stone" },
  { value: "pearl", label: "Pearl" },
  { value: "wood", label: "Wood" },
  { value: "metal", label: "Metal" },
  { value: "mixed", label: "Mixed" },
  { value: "other", label: "Other" },
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const toSafeInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const stripLeadingZeros = (str) => {
  if (str === "") return "";
  const cleaned = str.replace(/^0+(?=\d)/, "");
  return cleaned === "" ? "0" : cleaned;
};

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

  // ✅ Текстовий стан інпутів (щоб не було 0 попереду)
  const [minText, setMinText] = useState(String(currentMin));
  const [maxText, setMaxText] = useState(String(currentMax));

  // коли значення змінюються ззовні (слайдер/clear/apply) — синхронізуємо текст
  useEffect(() => {
    setMinText(String(currentMin));
  }, [currentMin]);

  useEffect(() => {
    setMaxText(String(currentMax));
  }, [currentMax]);

  const applyMinNumber = (num) => {
    const v = clamp(num, minLimit, currentMax);
    onDraftChange("priceMin", v);
  };

  const applyMaxNumber = (num) => {
    const raw = clamp(num, minLimit, maxLimit);

    // якщо max == maxLimit => "Any" (null)
    const nextMax = raw >= maxLimit ? null : raw;
    const nextMaxValue = nextMax === null ? maxLimit : nextMax;

    const nextMin = Math.min(currentMin, nextMaxValue);

    onDraftChange("priceMin", nextMin);
    onDraftChange("priceMax", nextMax);
  };

  const onMinInputChange = (e) => {
    // дозволяємо тільки цифри
    let v = e.target.value.replace(/[^\d]/g, "");
    v = stripLeadingZeros(v);
    setMinText(v);

    // якщо є число — одразу застосовуємо (без blur)
    if (v !== "") applyMinNumber(toSafeInt(v));
  };

  const onMaxInputChange = (e) => {
    let v = e.target.value.replace(/[^\d]/g, "");
    v = stripLeadingZeros(v);
    setMaxText(v);

    if (v !== "") applyMaxNumber(toSafeInt(v));
    // якщо пусто — візуально пусто, а реальний стейт зробимо onBlur
  };

  const onMinBlur = () => {
    if (minText === "") {
      setMinText("0");
      applyMinNumber(0);
      return;
    }
    applyMinNumber(toSafeInt(minText));
    setMinText(String(clamp(toSafeInt(minText), minLimit, currentMax)));
  };

  const onMaxBlur = () => {
    if (maxText === "") {
      // пустий max = Any
      setMaxText(String(maxLimit));
      applyMaxNumber(maxLimit);
      return;
    }
    const num = toSafeInt(maxText);
    applyMaxNumber(num);

    // показуємо вже “піджатий” варіант
    const normalized = clamp(num, minLimit, maxLimit);
    setMaxText(String(normalized));
  };

  const setMinFromRange = (val) => {
    const v = clamp(Number(val), minLimit, currentMax);
    onDraftChange("priceMin", v);
  };

  const setMaxFromRange = (val) => {
    const raw = clamp(Number(val), minLimit, maxLimit);
    applyMaxNumber(raw);
  };

  const toggleMaterial = (material) => {
    const current = Array.isArray(filtersDraft.materials)
      ? filtersDraft.materials
      : [];
    const next = current.includes(material)
      ? current.filter((item) => item !== material)
      : [...current, material];

    onDraftChange("materials", next);
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
        <p className={css.label}>Material</p>

        <div className={css.group}>
          {MATERIAL_OPTIONS.map((material) => (
            <label key={material.value} className={css.row}>
              <input
                type="checkbox"
                checked={Boolean(
                  filtersDraft.materials?.includes(material.value),
                )}
                onChange={() => toggleMaterial(material.value)}
              />
              <span>{material.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={`${css.block} ${css.borderTop}`}>
        <p className={css.label}>Price Range</p>

        {/* інпути */}
        <div className={css.priceInputs}>
          <label className={css.priceField}>
            <span className={css.priceFieldLabel}>Min</span>
            <div className={css.priceControl}>
              <span className={css.currency}>$</span>
              <input
                className={css.priceInput}
                type="text"
                inputMode="numeric"
                value={minText}
                onChange={onMinInputChange}
                onBlur={onMinBlur}
                placeholder="0"
              />
            </div>
          </label>

          <label className={css.priceField}>
            <span className={css.priceFieldLabel}>Max</span>
            <div className={css.priceControl}>
              <span className={css.currency}>$</span>
              <input
                className={css.priceInput}
                type="text"
                inputMode="numeric"
                value={maxText}
                onChange={onMaxInputChange}
                onBlur={onMaxBlur}
                placeholder={String(maxLimit)}
              />
            </div>
          </label>
        </div>

        {/* слайдери */}
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
              onChange={(e) => setMinFromRange(e.target.value)}
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
              onChange={(e) => setMaxFromRange(e.target.value)}
            />
          </label>
        </div>

        <p className={css.rangeHint}>Tip: set Max to the end for “Any”</p>
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
