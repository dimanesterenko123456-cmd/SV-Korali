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
                <span className={css.accent}>SV.Korali</span> — Wear Your
                Heritage
              </h2>

              <p className={css.p}>
                The Ukrainian brand SV.Korali was born from the idea of reviving
                ethnic jewelry here, far from our homeland — in Canada, which
                has become our home.
              </p>

              <p className={css.p}>
                Throughout the centuries, Ukrainian women have adorned
                themselves with beautiful and diverse ornaments, from the time
                of the Trypillia culture over 7,000 years ago to the present
                day.
              </p>

              <p className={css.p}>
                Ukraine has a rich and multifaceted culture, and each region, in
                different historical periods, developed its own unique jewelry
                traditions. This heritage provides an endless source of
                inspiration for contemporary jewelry art.
              </p>

              <p className={css.p}>
                SV.Korali creates modern pieces inspired by centuries-old
                traditions: korali (coral necklaces), balamuty, patsyoky,
                shelesty, darmovysy, zgardy, dukachi, herdany, sylianky, kryzy,
                and other ethnic-style jewelry.
              </p>

              <p className={css.p}>
                At the SV.Korali Ukrainian Showroom, you can also purchase
                materials for creating jewelry on your own — clasps, zgardy,
                coral, and more.
              </p>

              <p className={css.p}>
                By visiting our Ukrainian showroom at{" "}
                <a
                  className={css.inlineLink}
                  href="https://www.google.com/maps/search/?api=1&query=26-30+Six+Point+Rd,+Toronto+(Etobicoke)"
                  target="_blank"
                  rel="noreferrer"
                >
                  26–30 Six Point Rd., Toronto (Etobicoke)
                </a>{" "}
                or shopping online at{" "}
                <a
                  className={css.inlineLink}
                  href="https://sv.korali.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  sv.korali.com
                </a>
                , you can purchase authentic Ukrainian coral necklaces and other
                Ukrainian products, including headscarves, flower crowns
                (vinok), wooden crafts, souvenirs, and much more.
              </p>

              <p className={css.p}>
                <strong>Feel Ukraine in Canada.</strong>
              </p>

              <p className={css.p}>
                We warmly invite you to visit us and take home a piece of
                Ukrainian warmth.
              </p>
            </div>

            <div className={css.infoGrid}>
              <a
                className={css.infoCard}
                href="https://www.google.com/maps/search/?api=1&query=26-30+Six+Point+Rd,+Toronto+(Etobicoke)"
                target="_blank"
                rel="noreferrer"
              >
                <div className={css.infoLabel}>Showroom</div>
                <div className={css.infoValue}>
                  26–30 Six Point Rd., Toronto (Etobicoke)
                </div>
              </a>

              <a
                className={css.infoCard}
                href="https://sv.korali.com"
                target="_blank"
                rel="noreferrer"
              >
                <div className={css.infoLabel}>Online</div>
                <div className={css.infoValue}>sv.korali.com</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
