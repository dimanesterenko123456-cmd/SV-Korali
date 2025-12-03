import { NavLink } from "react-router-dom";
import { FiSearch, FiUser } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";

import Logo from "../Logo/Logo";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import css from "./Navigation.module.css";

const Navigation = () => {
  const handleBurgerClick = () => {
    console.log("Open sidebar menu");
  };

  return (
    <nav className={css.nav}>
      <div className={css.leftGroup}>
        <BurgerMenu onClick={handleBurgerClick} />

        <button type="button" className={css.iconButton} aria-label="Search">
          <FiSearch className={css.icon} />
        </button>
      </div>

      <div className={css.center}>
        <Logo />
      </div>

      <div className={css.rightGroup}>
        {/* <button type="button" className={css.langButton}>
          UA/EN
        </button> */}

        <NavLink to="/auth" className={css.iconButton} aria-label="Profile">
          <FiUser className={css.icon} />
        </NavLink>

        <NavLink to="/orders" className={css.iconButton} aria-label="Orders">
          <HiOutlineShoppingBag className={css.icon} />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
