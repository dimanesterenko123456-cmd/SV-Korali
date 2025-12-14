import css from "./OurStory.module.css";

const OurStory = () => {
  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.grid}>
          <div className={css.imageWrap}>
            <img
              className={css.image}
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d21f195269-966a24853a01994160e0.png"
              alt="Ukrainian family workshop crafting traditional coral jewelry"
              loading="lazy"
            />
          </div>

          <div className={css.content}>
            <div className={css.text}>
              <h2 className={css.title}>
                Three Generations of{" "}
                <span className={css.accent}>Artisan Excellence</span>
              </h2>

              <p className={css.p}>
                Founded in 1998 by master craftsman Petro Kovalenko, Korali
                began as a small family workshop in the heart of Carpathian
                Mountains. What started as a passion for preserving traditional
                Ukrainian coral jewelry techniques has grown into a celebrated
                brand trusted by collectors worldwide.
              </p>

              <p className={css.p}>
                Today, three generations of the Kovalenko family continue this
                legacy, combining time-honored methods with contemporary design
                sensibilities to create jewelry that honors the past while
                embracing the future.
              </p>
            </div>

            <div className={css.stats}>
              <div className={css.statCard}>
                <div className={css.statValue}>1998</div>
                <div className={css.statLabel}>Founded</div>
              </div>

              <div className={css.statCard}>
                <div className={css.statValue}>3</div>
                <div className={css.statLabel}>Generations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
