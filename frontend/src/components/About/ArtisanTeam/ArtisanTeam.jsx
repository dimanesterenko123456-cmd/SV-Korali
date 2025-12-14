import css from "./ArtisanTeam.module.css";

const ArtisanTeam = () => {
  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.head}>
          <h2 className={css.title}>Meet Our Master Artisans</h2>
          <p className={css.subtitle}>
            The talented hands and passionate hearts behind every piece of
            Korali jewelry
          </p>
        </div>

        <div className={css.grid}>
          <article className={css.card}>
            <div className={css.avatarWrap}>
              <img
                className={css.avatar}
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg"
                alt="Petro Kovalenko"
                loading="lazy"
              />
            </div>
            <h3 className={css.name}>Petro Kovalenko</h3>
            <p className={css.role}>Founder & Master Craftsman</p>
            <p className={css.text}>
              With over 40 years of experience, Petro established Korali to
              preserve the ancient art of Ukrainian coral jewelry making for
              future generations.
            </p>
          </article>

          <article className={css.card}>
            <div className={css.avatarWrap}>
              <img
                className={css.avatar}
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
                alt="Oksana Kovalenko"
                loading="lazy"
              />
            </div>
            <h3 className={css.name}>Oksana Kovalenko</h3>
            <p className={css.role}>Creative Director</p>
            <p className={css.text}>
              Oksana brings contemporary vision to traditional designs, creating
              pieces that honor heritage while appealing to modern
              sensibilities.
            </p>
          </article>

          <article className={css.card}>
            <div className={css.avatarWrap}>
              <img
                className={css.avatar}
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg"
                alt="Maksym Kovalenko"
                loading="lazy"
              />
            </div>
            <h3 className={css.name}>Maksym Kovalenko</h3>
            <p className={css.role}>Lead Artisan</p>
            <p className={css.text}>
              The third generation of Kovalenko craftsmen, Maksym combines
              traditional techniques with innovative approaches to jewelry
              making.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ArtisanTeam;
