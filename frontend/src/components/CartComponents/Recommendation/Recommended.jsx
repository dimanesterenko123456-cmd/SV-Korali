import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import css from "./Recommended.module.css";
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

const Recommended = ({ products = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = useSelector(selectAccessToken);
  const isLoggedIn = Boolean(accessToken);

  const handleOpen = (id) => {
    navigate(`/catalog/${id}`, {
      state: { from: location.pathname + location.search },
    });
  };

  const handleAdd = (event, product) => {
    event.stopPropagation();

    if (!isLoggedIn) {
      navigate("/auth/login", {
        state: { from: location.pathname + location.search },
        replace: false,
      });
      return;
    }

    dispatch(addToCart(product));
  };

  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.head}>
          <h2 className={css.title}>You Might Also Like</h2>
          <p className={css.sub}>
            Complete your collection with these handpicked pieces
          </p>
        </div>

        <div className={css.grid}>
          {products.map((product) => {
            const id = product?._id || product?.id;
            const image = getMainImage(product);
            const name = product?.name || "Product";
            const category =
              product?.collection || product?.category || "Collection";
            const price = formatPrice(product?.price);

            return (
              <article
                key={id}
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
                  <div className={css.imgWrap}>
                    {image ? (
                      <img
                        className={css.img}
                        src={image}
                        alt={name}
                        loading="lazy"
                      />
                    ) : (
                      <div className={css.imgPh} />
                    )}
                  </div>
                </div>

                <div className={css.info}>
                  <p className={css.meta}>{category}</p>
                  <h3 className={css.name}>{name}</h3>

                  <div className={css.bottom}>
                    <span className={css.price}>{price}</span>
                    <button
                      type="button"
                      className={css.btn}
                      onClick={(event) => handleAdd(event, product)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Recommended;
