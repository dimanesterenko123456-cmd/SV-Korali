import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import css from "./Recommended.module.css";
import { addToCart } from "../../../redux/slices/cartSlice";
import { selectAccessToken } from "../../../redux/selectors/authSelectors";

const getMainImage = (p) =>
  p?.image || (Array.isArray(p?.images) && p.images.length ? p.images[0] : "");

const money = (v) => {
  const n = Number(v);
  const safe = Number.isFinite(n) ? n : 0;
  return `$${safe.toFixed(0)}`;
};

const Recommended = ({ products = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = useSelector(selectAccessToken);
  const isLoggedIn = Boolean(accessToken);

  const handleAdd = (product) => {
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
          {products.map((p) => (
            <div key={p?._id || p?.id} className={css.card}>
              <div className={css.media}>
                <div className={css.imgWrap}>
                  {getMainImage(p) ? (
                    <img
                      className={css.img}
                      src={getMainImage(p)}
                      alt={p?.name || "product"}
                      loading="lazy"
                    />
                  ) : (
                    <div className={css.imgPh} />
                  )}
                </div>
              </div>

              <div className={css.info}>
                <h3 className={css.name}>{p?.name || "Product"}</h3>
                <p className={css.meta}>
                  {p?.collection || p?.category || "Collection"}
                </p>

                <div className={css.bottom}>
                  <span className={css.price}>{money(p?.price)}</span>
                  <button
                    type="button"
                    className={css.btn}
                    onClick={() => handleAdd(p)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommended;
