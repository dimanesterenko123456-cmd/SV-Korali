import { FaHeart, FaHandsHelping, FaLeaf } from "react-icons/fa";
import css from "./MissionValues.module.css";

const MissionValues = () => {
  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.head}>
          <h2 className={css.title}>Our Mission & Values</h2>
          <p className={css.subtitle}>
            We are committed to preserving Ukrainian cultural heritage while
            creating timeless pieces of extraordinary beauty
          </p>
        </div>

        <div className={css.grid}>
          <article className={css.card}>
            <div className={css.iconCircle}>
              <FaHeart className={css.icon} />
            </div>
            <h3 className={css.cardTitle}>Cultural Heritage</h3>
            <p className={css.cardText}>
              Every piece we create carries the soul of Ukrainian tradition,
              preserving centuries-old techniques and cultural significance for
              future generations.
            </p>
          </article>

          <article className={css.card}>
            <div className={css.iconCircle}>
              <FaHandsHelping className={css.icon} />
            </div>
            <h3 className={css.cardTitle}>Artisan Craftsmanship</h3>
            <p className={css.cardText}>
              Our master artisans dedicate their lives to perfecting traditional
              techniques, ensuring each piece meets the highest standards of
              quality and beauty.
            </p>
          </article>

          <article className={css.card}>
            <div className={css.iconCircle}>
              <FaLeaf className={css.icon} />
            </div>
            <h3 className={css.cardTitle}>Sustainable Practices</h3>
            <p className={css.cardText}>
              We source materials ethically and work with local communities to
              ensure our craft supports both cultural preservation and
              environmental responsibility.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default MissionValues;
