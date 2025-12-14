import css from "./ImpactCommunity.module.css";

const ImpactCommunity = () => {
  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.grid}>
          <div className={css.content}>
            <h2 className={css.title}>
              Supporting Our <span className={css.accent}>Community</span>
            </h2>

            <p className={css.p}>
              Korali is more than just a jewelry brand - we're a community
              dedicated to preserving Ukrainian culture and supporting local
              artisans. Through our Cultural Heritage Program, we provide
              training and employment opportunities to young craftspeople.
            </p>

            <p className={css.p}>
              We also partner with cultural organizations worldwide to promote
              Ukrainian heritage through exhibitions, workshops, and educational
              programs.
            </p>

            <div className={css.stats}>
              <div className={css.stat}>
                <div className={css.value}>50+</div>
                <div className={css.label}>Artisans Trained</div>
              </div>

              <div className={css.stat}>
                <div className={css.value}>25+</div>
                <div className={css.label}>Cultural Events</div>
              </div>

              <div className={css.stat}>
                <div className={css.value}>15</div>
                <div className={css.label}>Countries Reached</div>
              </div>
            </div>
          </div>

          <div className={css.imageWrap}>
            <img
              className={css.image}
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a1a4162f91-4572203c18865e6f99a1.png"
              alt="Ukrainian cultural workshop with artisans teaching young students"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactCommunity;
