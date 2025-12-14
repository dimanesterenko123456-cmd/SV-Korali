import css from "./AboutCTA.module.css";

const AboutCTA = () => {
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
          <button type="button" className={css.primary}>
            Explore Collections
          </button>
          <button type="button" className={css.secondary}>
            Visit Our Workshop
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
