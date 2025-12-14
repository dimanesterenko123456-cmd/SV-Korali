import css from "./HeroAbout.module.css";

const HeroAbout = () => {
  return (
    <section className={css.hero}>
      <div className={css.container}>
        <div className={css.content}>
          <h1 className={css.title}>
            Our <span className={css.accent}>Story</span>
          </h1>
          <p className={css.subtitle}>
            Discover the passion, heritage, and craftsmanship behind every piece
            of authentic Ukrainian coral jewelry
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroAbout;
