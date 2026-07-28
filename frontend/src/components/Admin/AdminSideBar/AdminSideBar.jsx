import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaChartBar,
  FaTags,
  FaCog,
  FaRegPlusSquare,
  FaTicketAlt,
} from "react-icons/fa";

import { GiHeartNecklace } from "react-icons/gi";
import css from "./AdminSideBar.module.css";

const AdminSidebar = () => {
  return (
    <div className={css.wrapper}>
      <div className={css.brand}>
        <div className={css.brandIcon}>
          <GiHeartNecklace />
        </div>
        <span className={css.brandText}>Korali Admin</span>
      </div>

      <nav className={css.nav}>
        {/* <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${css.link} ${isActive ? css.linkActive : ""}`
          }
        >
          <FaHome className={css.icon} />
          <span>Dashboard</span>
        </NavLink> */}

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `${css.link} ${isActive ? css.linkActive : ""}`
          }
        >
          <FaBox className={css.icon} />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/admin/products/new"
          className={({ isActive }) =>
            `${css.link} ${isActive ? css.linkActive : ""}`
          }
        >
          <FaRegPlusSquare className={css.icon} />
          <span>Add new</span>
        </NavLink>

        <NavLink
          to="/admin/coupons"
          className={({ isActive }) =>
            `${css.link} ${isActive ? css.linkActive : ""}`
          }
        >
          <FaTicketAlt className={css.icon} />
          <span>Coupons</span>
        </NavLink>

        {/* <NavLink
          to="/admin/customers"
          className={({ isActive }) =>
            `${css.link} ${isActive ? css.linkActive : ""}`
          }
        >
          <FaUsers className={css.icon} />
          <span>Customers</span>
        </NavLink> */}

        {/* <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            `${css.link} ${isActive ? css.linkActive : ""}`
          }
        >
          <FaChartBar className={css.icon} />
          <span>Analytics</span>
        </NavLink> */}

        {/* <NavLink
          to="/admin/collections"
          className={({ isActive }) =>
            `${css.link} ${isActive ? css.linkActive : ""}`
          }
        >
          <FaTags className={css.icon} />
          <span>Collections</span>
        </NavLink> */}

        {/* <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `${css.link} ${isActive ? css.linkActive : ""}`
          }
        > */}
        {/* <FaCog className={css.icon} />
          <span>Settings</span>
        </NavLink> */}
      </nav>

      <div className={css.userBlock}>
        <div className={css.userAvatar}>
          {/* тут потім можна підставити справжнє фото */}
          <span>AD</span>
        </div>
        <div className={css.userInfo}>
          <div className={css.userName}>Admin User</div>
          <div className={css.userEmail}>admin@korali.com</div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
