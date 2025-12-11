// src/components/Navigation/Navigation.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiLogOut, FiPlusSquare } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";

import Logo from "../Logo/Logo";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import css from "./Navigation.module.css";
import { logoutUserThunk } from "../../redux/operations/authOperations";
import {
  selectAccessToken,
  selectUserRole,
} from "../../redux/selectors/authSelectors";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = useSelector(selectAccessToken);
  const userRole = useSelector(selectUserRole);
  const isLoggedIn = Boolean(accessToken);
  const isAdmin = isLoggedIn && userRole === "admin";

  const handleBurgerClick = () => {
    console.log("Open sidebar menu");
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className={css.nav}>
      <div className={css.leftGroup}>
        <BurgerMenu onClick={handleBurgerClick} />
      </div>

      <div className={css.center}>
        <Logo />
      </div>

      <div className={css.rightGroup}>
        {/* <button type="button" className={css.langButton}>
          UA/EN
        </button> */}

        <NavLink
          to="/auth/login" // відкриваємо форму логіну
          className={css.iconButton}
          aria-label="Profile"
        >
          <FiUser className={css.icon} />
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin/add-product"
            className={`${css.iconButton} ${css.adminButton}`}
            aria-label="Add or edit products"
          >
            <FiPlusSquare className={css.icon} />
          </NavLink>
        )}

        <NavLink to="/orders" className={css.iconButton} aria-label="Orders">
          <HiOutlineShoppingBag className={css.icon} />
        </NavLink>

        {isLoggedIn && (
          <button
            type="button"
            className={css.iconButton}
            aria-label="Logout"
            onClick={handleLogout}
          >
            <FiLogOut className={css.icon} />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
