import css from "./AdminStatsCards.module.css";

const cards = [
  {
    id: "revenue",
    label: "Total revenue",
    value: "$12,480",
    note: "+18% vs last month",
  },
  {
    id: "orders",
    label: "Orders",
    value: "264",
    note: "24 pending",
  },
  {
    id: "products",
    label: "Products",
    value: "38",
    note: "4 low in stock",
  },
  {
    id: "customers",
    label: "Customers",
    value: "512",
    note: "32 new this month",
  },
];

const AdminStatsCards = () => {
  return (
    <section className={css.section} aria-label="Key metrics">
      <ul className={css.grid}>
        {cards.map((card) => (
          <li key={card.id} className={css.card}>
            <p className={css.label}>{card.label}</p>
            <p className={css.value}>{card.value}</p>
            <p className={css.note}>{card.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminStatsCards;
