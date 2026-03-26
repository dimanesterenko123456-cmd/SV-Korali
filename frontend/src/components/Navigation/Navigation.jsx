// src/components/Navigation/Navigation.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiPlusSquare } from "react-icons/fi";
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
import { selectCartCount } from "../../redux/selectors/cartSelectors";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = useSelector(selectAccessToken);
  const userRole = useSelector(selectUserRole);
  const cartCount = useSelector(selectCartCount);

  const isLoggedIn = Boolean(accessToken);
  const isAdmin = isLoggedIn && userRole === "admin";

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
      {/* LEFT */}
      <div className={css.left}>
        <BurgerMenu
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          cartCount={cartCount}
          onLogout={handleLogout}
          buttonClassName={css.burgerButton}
        />

        <div className={css.navLinks}>
          <NavLink
            to="/catalog"
            end
            className={({ isActive }) =>
              isActive ? `${css.navLink} ${css.navLinkActive}` : css.navLink
            }
          >
            Catalog
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? `${css.navLink} ${css.navLinkActive}` : css.navLink
            }
          >
            About
          </NavLink>
        </div>
      </div>

      {/* CENTER */}
      <div className={css.center}>
        <Logo />
      </div>

      {/* RIGHT */}
      <div className={css.actions}>
        {isAdmin && (
          <NavLink
            to="/admin/products"
            className={`${css.iconButton} ${css.adminButton}`}
            aria-label="Add or edit products"
          >
            <FiPlusSquare className={css.icon} />
          </NavLink>
        )}

        <NavLink
          to="/cart"
          className={`${css.iconButton} ${css.cartButton}`}
          aria-label="Orders"
        >
          <HiOutlineShoppingBag className={css.icon} />
          {cartCount > 0 && <span className={css.cartBadge}>{cartCount}</span>}
        </NavLink>

        {!isLoggedIn && (
          <NavLink
            to="/auth/login"
            className={`${css.iconButton} ${css.profileButton}`}
            aria-label="Profile"
          >
            <FiUser className={css.icon} />
          </NavLink>
        )}
        {isLoggedIn && (
          <button
            type="button"
            className={`${css.iconButton} ${css.logoutButton}`}
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
