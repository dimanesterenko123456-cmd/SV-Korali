// src/components/SearchBox/SearchBox.jsx
import { FiSearch } from "react-icons/fi";
import css from "./SearchBox.module.css";

const SearchBox = ({ onChange, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <input
        className={css.input}
        type="text"
        placeholder="Search products..."
        onChange={onChange}
      />
      <button type="submit" className={css.btn} aria-label="Search">
        <FiSearch className={css.icon} />
      </button>
    </form>
  );
};

export default SearchBox;
