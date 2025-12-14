import css from "./AdminTableSection.module.css";

const topProducts = [
  { id: 1, name: "Carpathian Coral Necklace", category: "Necklace", sold: 38 },
  { id: 2, name: "Heritage Coral Bracelet", category: "Bracelet", sold: 24 },
  { id: 3, name: "Classic Coral Earrings", category: "Earrings", sold: 19 },
];

const recentOrders = [
  { id: "#1024", customer: "Maria Kovalenko", total: "$189", status: "Paid" },
  { id: "#1023", customer: "Anna Petrenko", total: "$289", status: "Shipped" },
  { id: "#1022", customer: "Sofia Ivanets", total: "$349", status: "Pending" },
];

const AdminTablesSection = () => {
  return (
    <section className={css.section}>
      <div className={css.card}>
        <header className={css.cardHeader}>
          <h2 className={css.cardTitle}>Top products</h2>
          <span className={css.badge}>{topProducts.length}</span>
        </header>

        <table className={css.table}>
          <thead>
            <tr>
              <th className={css.th}>Product</th>
              <th className={css.th}>Category</th>
              <th className={css.thRight}>Sold</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p) => (
              <tr key={p.id}>
                <td className={css.tdPrimary}>{p.name}</td>
                <td className={css.td}>{p.category}</td>
                <td className={css.tdRight}>{p.sold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={css.card}>
        <header className={css.cardHeader}>
          <h2 className={css.cardTitle}>Recent orders</h2>
          <span className={css.badge}>{recentOrders.length}</span>
        </header>

        <table className={css.table}>
          <thead>
            <tr>
              <th className={css.th}>Order</th>
              <th className={css.th}>Customer</th>
              <th className={css.th}>Status</th>
              <th className={css.thRight}>Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id}>
                <td className={css.tdPrimary}>{o.id}</td>
                <td className={css.td}>{o.customer}</td>
                <td className={css.tdStatus}>
                  <span
                    className={`${css.statusBadge} ${
                      o.status === "Paid"
                        ? css.statusPaid
                        : o.status === "Shipped"
                        ? css.statusShipped
                        : css.statusPending
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className={css.tdRight}>{o.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminTablesSection;
