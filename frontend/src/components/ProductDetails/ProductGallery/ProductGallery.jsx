import { useMemo, useState } from "react";
import { FiAward, FiTruck, FiRefreshCcw, FiShield } from "react-icons/fi";
import css from "./ProductGallery.module.css";

const ProductGallery = ({ images = [] }) => {
  const safeImages = useMemo(() => {
    return Array.isArray(images) ? images.filter(Boolean) : [];
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);

  const mainImage =
    safeImages[activeIndex] ||
    safeImages[0] ||
    "https://via.placeholder.com/900x1100?text=SV.Korali";

  const highlights = [
    {
      icon: <FiAward />,
      title: "Authentic Materials",
      text: "100% genuine coral",
    },
    {
      icon: <FiShield />,
      title: "Handcrafted",
      text: "Made by artisans",
    },
    {
      icon: <FiTruck />,
      title: "Free Shipping",
    },
    {
      icon: <FiRefreshCcw />,
      title: "30-Day Returns",
      text: "Hassle-free policy",
    },
  ];

  return (
    <section className={css.gallery}>
      <div className={css.mainImageWrap}>
        <img
          src={mainImage}
          alt="Product preview"
          className={css.mainImage}
          loading="lazy"
        />
      </div>

      {safeImages.length > 1 ? (
        <div className={css.thumbGrid}>
          {safeImages.slice(0, 4).map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`${css.thumbBtn} ${
                index === activeIndex ? css.thumbBtnActive : ""
              }`}
              aria-label={`Show image ${index + 1}`}
            >
              <img src={src} alt="" className={css.thumbImage} />
            </button>
          ))}
        </div>
      ) : null}

      <div className={css.features}>
        {highlights.map((h) => (
          <div key={h.title} className={css.featureCard}>
            <div className={css.featureIcon}>{h.icon}</div>
            <div className={css.featureText}>
              <p className={css.featureTitle}>{h.title}</p>
              <p className={css.featureSub}>{h.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGallery;
