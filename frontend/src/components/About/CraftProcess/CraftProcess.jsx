import css from "./CraftProcess.module.css";

const CraftProcess = () => {
  const steps = [
    {
      n: 1,
      title: "Selection",
      text: "Carefully selecting premium coral beads based on color, size, and quality standards.",
    },
    {
      n: 2,
      title: "Design",
      text: "Creating unique patterns that honor traditional Ukrainian motifs and symbolism.",
    },
    {
      n: 3,
      title: "Crafting",
      text: "Hand-stringing each bead with traditional techniques passed down through generations.",
    },
    {
      n: 4,
      title: "Finishing",
      text: "Final quality inspection and blessing, ensuring each piece meets our exacting standards.",
    },
  ];

  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.head}>
          <h2 className={css.title}>Our Craft Process</h2>
          <p className={css.subtitle}>
            From raw coral to finished masterpiece, every step is guided by
            tradition and passion
          </p>
        </div>

        <div className={css.grid}>
          {steps.map((s) => (
            <article key={s.n} className={css.step}>
              <div className={css.circle}>{s.n}</div>
              <h3 className={css.stepTitle}>{s.title}</h3>
              <p className={css.stepText}>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CraftProcess;
