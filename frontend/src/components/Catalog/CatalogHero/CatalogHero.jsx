import css from "./CatalogHero.module.css";

const CatalogHero = () => {
  return (
    <section className={css.hero}>
      <div className={css.container}>
        <h1 className={css.title}>Shop Collection</h1>

        <p className={css.subtitle}>
          Discover our complete range of authentic Ukrainian coral jewelry,
          handcrafted with traditional techniques
        </p>
      </div>
    </section>
  );
};

export default CatalogHero;
