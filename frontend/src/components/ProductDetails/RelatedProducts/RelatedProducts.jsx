import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import css from "./RelatedProducts.module.css";

import { addToCart } from "../../../redux/slices/cartSlice";
import { selectAccessToken } from "../../../redux/selectors/authSelectors";

const getMainImage = (product) =>
  product?.image ||
  (Array.isArray(product?.images) && product.images.length > 0
    ? product.images[0]
    : "");

const formatPrice = (value) => {
  const num = Number(value);

  if (!Number.isFinite(num)) return "—";

  return Number.isInteger(num) ? `$${num}` : `$${num.toFixed(2)}`;
};

const RelatedProducts = ({ products = [], currentId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useSelector(selectAccessToken);
  const isLoggedIn = Boolean(accessToken);

  const visible = products
    .filter((p) => (p?._id || p?.id) !== currentId)
    .slice(0, 4);

  if (!visible.length) return null;

  const handleOpen = (id) => {
    navigate(`/catalog/${id}`, {
      state: { from: location.pathname + location.search },
    });
  };

  const handleAddToCart = (event, product) => {
    event.stopPropagation();

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
          const id = product?._id || product?.id;
          const image = getMainImage(product);
          const name = product?.name || "Product";
          const category =
            product?.collection || product?.category || "Collection";
          const price = formatPrice(product?.price);

          return (
            <li key={id} className={css.item}>
              <article
                className={css.card}
                onClick={() => handleOpen(id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpen(id);
                  }
                }}
              >
                <div className={css.media}>
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
                </div>

                <div className={css.content}>
                  <p className={css.meta}>{category}</p>
                  <h3 className={css.name}>{name}</h3>

                  <div className={css.bottom}>
                    <span className={css.price}>{price}</span>

                    <button
                      type="button"
                      className={css.cartBtn}
                      onClick={(event) => handleAddToCart(event, product)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default RelatedProducts;
