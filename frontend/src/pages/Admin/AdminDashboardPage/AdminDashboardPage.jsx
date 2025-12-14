import AdminSalesOverview from "../../../components/Admin/AdminSalesOverview/AdminSalesOverview";
import AdminStatsCards from "../../../components/Admin/AdminStatsCards/AdminStatsCards";
import AdminTablesSection from "../../../components/Admin/AdminTableSection/AdminTableSection";
import css from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  return (
    <section className={css.page}>
      <header className={css.header}>
        <p className={css.breadcrumb}>
          <a className={css.breadcrumbLink} href="/">
            Home
          </a>{" "}
          / <span>Dashboard</span>
        </p>
        <h1 className={css.title}>Shop Dashboard</h1>
        <p className={css.subtitle}>
          Overview of sales, products and orders for your SV.KORALI store.
        </p>
      </header>

      <div className={css.content}>
        <AdminStatsCards />

        <AdminSalesOverview />

        <AdminTablesSection />
      </div>
    </section>
  );
};

export default AdminDashboard;
