import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiClock } from "react-icons/fi";
import css from "./SearchBox.module.css";

const RECENT_KEY = "catalog_recent_searches_v1";

const readRecent = () => {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeRecent = (items) => {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

const SearchBox = ({
  value = "",
  onChange,
  onSubmit,
  onSelect,
  suggestions = [],
}) => {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState(() => readRecent());

  const wrapRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const normalized = value.trim().toLowerCase();

  const recommended = useMemo(() => {
    if (!normalized) return [];
    const uniq = Array.from(new Set(suggestions));
    return uniq.filter((s) => s.toLowerCase().includes(normalized)).slice(0, 6);
  }, [normalized, suggestions]);

  const showRecent = !normalized && recent.length > 0;

  const commitRecent = (q) => {
    const cleaned = q.trim();
    if (!cleaned) return;

    const next = [cleaned, ...recent.filter((x) => x !== cleaned)].slice(0, 6);
    setRecent(next);
    writeRecent(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    commitRecent(value);
    onSubmit?.(value);
    setOpen(false);
  };

  const handlePick = (q) => {
    commitRecent(q);
    onSelect?.(q);
    setOpen(false);
  };

  return (
    <div className={css.wrap} ref={wrapRef}>
      <form className={css.form} onSubmit={handleSubmit}>
        <input
          className={css.input}
          type="text"
          placeholder="Search..."
          value={value}
          onChange={(e) => {
            onChange?.(e);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />

        <button type="submit" className={css.btn} aria-label="Search">
          <FiSearch className={css.icon} />
        </button>
      </form>

      {open && (showRecent || recommended.length > 0) && (
        <div className={css.dropdown}>
          {showRecent && (
            <div className={css.block}>
              <p className={css.blockTitle}>Recent searches</p>
              <ul className={css.list}>
                {recent.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      className={css.itemBtn}
                      onClick={() => handlePick(q)}
                    >
                      <FiClock className={css.smallIcon} />
                      <span className={css.itemText}>{q}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommended.length > 0 && (
            <div className={css.block}>
              <p className={css.blockTitle}>Recommendations</p>
              <ul className={css.list}>
                {recommended.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      className={css.itemBtn}
                      onClick={() => handlePick(q)}
                    >
                      <span className={css.itemText}>{q}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
