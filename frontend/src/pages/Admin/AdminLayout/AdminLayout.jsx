import { Outlet } from "react-router-dom";

import css from "./AdminLayout.module.css";
import AdminSidebar from "../../../components/Admin/AdminSideBar/AdminSideBar";
import AdminTopbar from "../../../components/Admin/AdminTopBar/AdminTopBar";

const AdminLayout = () => {
  return (
    <div id="admin-layout" className={css.layout}>
      <aside id="sidebar" className={css.sidebar}>
        <AdminSidebar />
      </aside>

      <div id="main-content" className={css.main}>
        <AdminTopbar />
        <main className={css.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
