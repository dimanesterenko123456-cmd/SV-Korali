import {
  FiCreditCard,
  FiHeart,
  FiLock,
  FiMail,
  FiRefreshCw,
  FiTruck,
} from "react-icons/fi";

import css from "./PolicyPage.module.css";

const policies = [
  {
    icon: FiTruck,
    title: "Shipping",
    text: "Shipping options, cost, and the estimated delivery window are confirmed at checkout. Please check your address carefully; delivery delays caused by carriers or customs can happen outside our control.",
  },
  {
    icon: FiRefreshCw,
    title: "Returns",
    text: "Contact us within 30 days of delivery if you need a return. Items must be unworn, undamaged, and in their original condition. Custom or personalized pieces are final sale unless they arrive damaged or incorrect.",
  },
  {
    icon: FiCreditCard,
    title: "Payment & orders",
    text: "An order is confirmed after successful payment. If an item becomes unavailable, we will contact you promptly and arrange a replacement or refund.",
  },
  {
    icon: FiHeart,
    title: "Jewelry care",
    text: "Keep your jewelry away from water, perfume, hairspray, and household chemicals. Store each piece separately in a dry place and handle the beadwork gently.",
  },
  {
    icon: FiLock,
    title: "Privacy",
    text: "We use the information you provide to process orders, arrange delivery, and answer support requests. We do not sell your personal information.",
  },
  {
    icon: FiMail,
    title: "Questions",
    text: "Need help before ordering or with an existing order? Email sv.korali@gmail.com and include your order number when possible.",
  },
];

const PolicyPage = () => {
  return (
    <section className={css.page}>
      <div className={css.container}>
        <header className={css.hero}>
          <span className={css.eyebrow}>SV.KORALI</span>
          <h1 className={css.title}>Policies made simple</h1>
          <p className={css.intro}>
            Clear information about ordering, delivery, returns, and caring
            for your handcrafted jewelry.
          </p>
          <p className={css.updated}>Last updated: September 2026</p>
        </header>

        <div className={css.grid}>
          {policies.map(({ icon: Icon, title, text }) => (
            <article className={css.card} key={title}>
              <div className={css.icon} aria-hidden="true">
                <Icon />
              </div>
              <div>
                <h2 className={css.cardTitle}>{title}</h2>
                <p className={css.cardText}>{text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={css.note}>
          <strong>Natural materials vary.</strong> Small differences in color,
          texture, and bead placement are part of the character of a handmade
          piece. If something is not right with your order, please contact us
          before sending it back so we can help quickly.
        </div>
      </div>
    </section>
  );
};

export default PolicyPage;
