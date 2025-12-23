import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import css from "./RelatedProducts.module.css";

import { addToCart } from "../../../redux/slices/cartSlice";
import { selectAccessToken } from "../../../redux/selectors/authSelectors";

const RelatedProducts = ({ products = [], currentId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useSelector(selectAccessToken);
  const isLoggedIn = Boolean(accessToken);

  const visible = products
    .filter((p) => (p._id || p.id) !== currentId)
    .slice(0, 4);

  if (!visible.length) {
    return null;
  }

  const handleOpen = (id) => {
    navigate(`/catalog/${id}`);
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      navigate("/auth/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }
    dispatch(addToCart(product));
  };

  return (
    <section className={css.section}>
      <div className={css.headerRow}>
        <h2 className={css.title}>You may also like</h2>
        <p className={css.subtitle}>
          Discover more handcrafted coral pieces that match this style.
        </p>
      </div>

      <ul className={css.list}>
        {visible.map((product) => {
          const id = product._id || product.id;
          const image =
            product.image ||
            (Array.isArray(product.images) && product.images.length > 0
              ? product.images[0]
              : "");
          const name = product.name || "Product";
          const rawPrice = product.price;
          const numPrice = Number(rawPrice);
          const price =
            rawPrice != null && rawPrice !== ""
              ? Number.isFinite(numPrice)
                ? `$${numPrice.toFixed(2)}`
                : `$${rawPrice}`
              : "—";

          return (
            <li key={id} className={css.card}>
              <button
                type="button"
                className={css.cardInner}
                onClick={() => handleOpen(id)}
              >
                <div className={css.thumbWrap}>
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className={css.thumb}
                      loading="lazy"
                    />
                  ) : (
                    <div className={css.thumbPlaceholder} />
                  )}
                </div>

                <div className={css.content}>
                  <h3 className={css.name}>{name}</h3>
                  <span className={css.price}>{price}</span>
                </div>
              </button>

              <button
                type="button"
                className={css.cartBtn}
                onClick={() => handleAddToCart(product)}
              >
                Add to cart
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default RelatedProducts;
