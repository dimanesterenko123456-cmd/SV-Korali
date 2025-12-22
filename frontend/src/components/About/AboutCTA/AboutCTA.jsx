import { useNavigate } from "react-router-dom";
import css from "./AboutCTA.module.css";

const AboutCTA = () => {
  const navigate = useNavigate();

  const goToCatalog = () => navigate("/catalog");

  const openWorkshop = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=26-30+Six+Point+Rd,+Toronto+(Etobicoke)",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className={css.section}>
      <div className={css.container}>
        <h2 className={css.title}>Become Part of Our Story</h2>
        <p className={css.text}>
          Join thousands of customers worldwide who treasure authentic Ukrainian
          coral jewelry. Each purchase supports our mission to preserve cultural
          heritage.
        </p>

        <div className={css.actions}>
          <button type="button" className={css.primary} onClick={goToCatalog}>
            Explore Collections
          </button>
          <button
            type="button"
            className={css.secondary}
            onClick={openWorkshop}
          >
            Visit Our Workshop
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
