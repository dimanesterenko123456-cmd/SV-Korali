import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut, FiPlusSquare } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";

import css from "./BurgerMenu.module.css";

const BurgerMenu = ({
  isLoggedIn,
  isAdmin,
  cartCount,
  onLogout,
  buttonClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const portalTarget = useMemo(() => document.body, []);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) close();
  };

  const handleLogoutClick = async () => {
    if (onLogout) await onLogout();
    close();
  };

  return (
    <>
      <button
        type="button"
        className={buttonClassName ?? css.burgerButton}
        aria-label="Open menu"
        onClick={open}
      >
        <FiMenu className={css.burgerIcon} />
      </button>

      {isOpen &&
        createPortal(
          <div
            className={css.overlay}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onMouseDown={handleOverlayMouseDown}
          >
            <div className={css.panel} onMouseDown={(e) => e.stopPropagation()}>
              <div className={css.top}>
                <span className={css.title}>Menu</span>
                <button
                  type="button"
                  className={css.closeButton}
                  aria-label="Close menu"
                  onClick={close}
                >
                  <FiX className={css.closeIcon} />
                </button>
              </div>

              <div className={css.section}>
                <NavLink
                  to="/catalog"
                  className={({ isActive }) =>
                    isActive ? `${css.link} ${css.linkActive}` : css.link
                  }
                  onClick={close}
                >
                  Catalog
                </NavLink>

                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? `${css.link} ${css.linkActive}` : css.link
                  }
                  onClick={close}
                >
                  About
                </NavLink>
              </div>

              <div className={css.section}>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive
                        ? `${css.actionLink} ${css.linkActive}`
                        : css.actionLink
                    }
                    onClick={close}
                  >
                    <FiPlusSquare className={css.actionIcon} />
                    <span>Admin</span>
                  </NavLink>
                )}

                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    isActive
                      ? `${css.actionLink} ${css.linkActive}`
                      : css.actionLink
                  }
                  onClick={close}
                >
                  <HiOutlineShoppingBag className={css.actionIcon} />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className={css.badge}>{cartCount}</span>
                  )}
                </NavLink>

                <NavLink
                  to="/auth/login"
                  className={({ isActive }) =>
                    isActive
                      ? `${css.actionLink} ${css.linkActive}`
                      : css.actionLink
                  }
                  onClick={close}
                >
                  <FiUser className={css.actionIcon} />
                  <span>Profile</span>
                </NavLink>

                {isLoggedIn && (
                  <button
                    type="button"
                    className={css.actionButton}
                    onClick={handleLogoutClick}
                  >
                    <FiLogOut className={css.actionIcon} />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>,
          portalTarget
        )}
    </>
  );
};

export default BurgerMenu;
