import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import koraliImg from "../../assets/Korali.png";

import css from "./WelcomePage.module.css";
import {
  selectProducts,
  selectProductsError,
  selectProductsLoading,
} from "../../redux/selectors/productSelectors";
import { fetchProductsThunk } from "../../redux/operations/productOperations";
import Loader from "../../components/Loader/Loader";

const WelcomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    dispatch(fetchProductsThunk({ page: 1, perPage: 6 }));
  }, [dispatch]);

  const featured = products.slice(0, 3);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShopCollection = () => {
    navigate("/catalog");
  };

  const handleLearnMore = () => {
    scrollToId("heritage");
  };

  const handleViewAll = () => {
    navigate("/catalog");
  };

  const handleViewDetails = (productId) => {
    // Якщо у тебе інший роут деталей — просто зміни тут
    navigate(`/catalog/${productId}`);
  };

  return (
    <div className={css.page}>
      {/* HERO */}
      <section className={css.hero}>
        <div className={css.heroText}>
          <p className={css.heroEyebrow}>Authentic Ukrainian Coral Jewelry</p>

          <h1 className={css.heroTitle}>
            Authentic <span>Ukrainian</span>
            <br />
            Coral Jewelry
          </h1>

          <p className={css.heroSubtitle}>
            Handcrafted traditional coral necklaces preserving centuries of
            Ukrainian heritage and artistry.
          </p>

          <div className={css.heroActions}>
            <button
              type="button"
              className={css.primaryBtn}
              onClick={handleShopCollection}
            >
              Shop collection
            </button>

            <button
              type="button"
              className={css.secondaryBtn}
              onClick={handleLearnMore}
            >
              Learn more
            </button>
          </div>

          <ul className={css.heroStats}>
            <li>
              <span className={css.statsNumber}>500+</span>
              <span className={css.statsLabel}>Happy customers</span>
            </li>
            <li>
              <span className={css.statsNumber}>100%</span>
              <span className={css.statsLabel}>Authentic</span>
            </li>
            <li>
              <span className={css.statsNumber}>25+</span>
              <span className={css.statsLabel}>Years experience</span>
            </li>
          </ul>
        </div>

        <div className={css.heroImage}>
          <div className={css.heroImageInner}>
            <div className={css.heroImagePlaceholder}>
              <img src={koraliImg} alt="Authentic Ukrainian coral jewelry" />
            </div>
          </div>

          <div className={css.heroBadge}>
            <div className={css.badgeDot} />
            <div>
              <p className={css.badgeTitle}>Certified Authentic</p>
              <p className={css.badgeSubtitle}>Traditional Ukrainian Craft</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <section className={css.featured} id="featured">
        <p className={css.sectionEyebrow}>Featured collections</p>
        <h2 className={css.sectionTitle}>Our favourite coral pieces</h2>
        <p className={css.sectionSubtitle}>
          Discover our most beloved traditional coral necklaces, each piece
          telling a story of Ukrainian heritage.
        </p>

        {isLoading && (
          <div className={css.featuredLoader}>
            <Loader />
          </div>
        )}

        {!isLoading && error && (
          <p className={css.error}>
            {typeof error === "string"
              ? error
              : "Failed to load products. Please try again later."}
          </p>
        )}

        {!isLoading && !error && !!featured.length && (
          <div className={css.cardsGrid}>
            {featured.map((product) => {
              const mainImage =
                product?.image ||
                (Array.isArray(product?.images) ? product.images[0] : "");

              return (
                <article key={product._id} className={css.productCard}>
                  <div className={css.productImageWrap}>
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.name}
                        className={css.productImage}
                        loading="lazy"
                      />
                    ) : (
                      <div className={css.productImagePlaceholder} />
                    )}
                  </div>

                  <p className={css.productTag}>
                    {product.category || "Traditional collection"}
                  </p>

                  <h3 className={css.productName}>{product.name}</h3>

                  {product.description && (
                    <p className={css.productDesc}>{product.description}</p>
                  )}

                  <div className={css.productFooter}>
                    <span className={css.productPrice}>
                      {product.price != null ? `$${product.price}` : "—"}
                    </span>

                    <button
                      type="button"
                      className={css.cardBtn}
                      onClick={() => handleViewDetails(product._id)}
                    >
                      View details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!isLoading && !error && !featured.length && (
          <p className={css.empty}>No products yet, please check later.</p>
        )}

        <div className={css.viewAllWrap}>
          <button
            type="button"
            className={css.viewAllBtn}
            onClick={handleViewAll}
          >
            View all products
          </button>
        </div>
      </section>

      {/* HERITAGE SECTION */}
      <section className={css.heritage} id="heritage">
        <div className={css.heritageText}>
          <p className={css.sectionEyebrow}>Preserving Ukrainian Heritage</p>
          <h2 className={css.sectionTitle}>
            For over 25 years,
            <br />
            we have been dedicated to preserving the ancient art of Ukrainian
            coral jewelry making.
          </h2>

          <p className={css.sectionSubtitle}>
            Each piece is carefully handcrafted using traditional techniques
            passed down through generations.
          </p>

          <ul className={css.heritageList}>
            <li>
              <span className={css.bulletIcon}>●</span>
              <div>
                <p className={css.bulletTitle}>Handcrafted excellence</p>
                <p className={css.bulletText}>
                  Every necklace is meticulously crafted by skilled artisans
                  using traditional Ukrainian techniques.
                </p>
              </div>
            </li>
            <li>
              <span className={css.bulletIcon}>●</span>
              <div>
                <p className={css.bulletTitle}>Authentic materials</p>
                <p className={css.bulletText}>
                  We source only the finest natural coral beads and traditional
                  materials for our jewelry.
                </p>
              </div>
            </li>
            <li>
              <span className={css.bulletIcon}>●</span>
              <div>
                <p className={css.bulletTitle}>Cultural legacy</p>
                <p className={css.bulletText}>
                  Each piece carries the rich cultural heritage and symbolism of
                  Ukrainian traditions.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className={css.heritageImageWrap}>
          <div className={css.heritageImagePlaceholder}>
            <img
              src="https://res.cloudinary.com/dtbdyhluo/image/upload/v1780161864/IMG_20260530_115213_nufkpn.jpg"
              alt="Ukrainian coral jewelry heritage"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={css.testimonials}>
        <p className={css.sectionEyebrow}>What our customers say</p>
        <h2 className={css.sectionTitle}>
          Trusted by jewelry lovers worldwide
        </h2>

        <div className={css.testimonialsGrid}>
          <article className={css.testimonialCard}>
            <p className={css.stars}>★★★★★</p>
            <p className={css.testimonialText}>
              “The quality and craftsmanship of my coral necklace is absolutely
              stunning. It&apos;s become my most treasured piece of jewelry.”
            </p>
            <p className={css.testimonialAuthor}>Maria Kovalenko</p>
            <p className={css.testimonialMeta}>Toronto, Canada</p>
          </article>

          <article className={css.testimonialCard}>
            <p className={css.stars}>★★★★★</p>
            <p className={css.testimonialText}>
              “As someone with Ukrainian heritage, wearing these pieces makes me
              feel connected to my roots. Beautiful work!”
            </p>
            <p className={css.testimonialAuthor}>Anna Petrenko</p>
            <p className={css.testimonialMeta}>New York, USA</p>
          </article>

          <article className={css.testimonialCard}>
            <p className={css.stars}>★★★★★</p>
            <p className={css.testimonialText}>
              “Exceptional quality and authentic design. The attention to detail
              is remarkable and the necklace is absolutely stunning.”
            </p>
            <p className={css.testimonialAuthor}>Sofia Ivanet</p>
            <p className={css.testimonialMeta}>London, UK</p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;
