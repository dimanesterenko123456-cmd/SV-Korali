import css from "./AdminSalesOverview.module.css";

const AdminSalesOverview = () => {
  return (
    <section className={css.section} aria-label="Sales overview">
      <div className={css.mainCard}>
        <header className={css.cardHeader}>
          <div>
            <h2 className={css.cardTitle}>Revenue overview</h2>
            <p className={css.cardSubtitle}>Last 30 days</p>
          </div>

          <select className={css.select}>
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>This year</option>
          </select>
        </header>

        {/* simple faux chart */}
        <div className={css.chart}>
          {[40, 60, 35, 80, 55, 90, 65].map((h, idx) => (
            <div key={idx} className={css.barWrapper}>
              <span className={css.bar} style={{ height: `${h}%` }}></span>
            </div>
          ))}
        </div>

        <footer className={css.cardFooter}>
          <p className={css.footerStat}>
            <span className={css.statLabel}>This month</span>
            <span className={css.statValue}>$12,480</span>
          </p>
          <p className={css.footerStat}>
            <span className={css.statLabel}>Previous month</span>
            <span className={css.statMuted}>$10,560</span>
          </p>
        </footer>
      </div>

      <div className={css.sideColumn}>
        <div className={css.sideCard}>
          <h3 className={css.sideTitle}>Conversion</h3>
          <p className={css.sideValue}>3.8%</p>
          <p className={css.sideNote}>+0.6% vs last period</p>

          <div className={css.progressTrack}>
            <div className={css.progressFill} />
          </div>
        </div>

        <div className={css.sideCard}>
          <h3 className={css.sideTitle}>Average order value</h3>
          <p className={css.sideValue}>$74.20</p>
          <p className={css.sideNote}>+4.2% vs last month</p>
        </div>
      </div>
    </section>
  );
};

export default AdminSalesOverview;
