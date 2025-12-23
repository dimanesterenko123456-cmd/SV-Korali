import ProductDetail from "../ProductDetail/ProductDetail";
import css from "./CatalogItem.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { selectAccessToken } from "../../redux/selectors/authSelectors";

const CatalogItem = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = useSelector(selectAccessToken);
  const isLoggedIn = Boolean(accessToken);

  const mainImage =
    product?.image ||
    (Array.isArray(product?.images) && product.images.length > 0
      ? product.images[0]
      : "");

  const rawPrice = product?.price;
  const numPrice = Number(rawPrice);
  const price =
    rawPrice != null && rawPrice !== ""
      ? Number.isFinite(numPrice)
        ? `$${numPrice}`
        : `$${rawPrice}`
      : "—";

  const ratingValue = Number(
    product?.rating ?? product?.avgRating ?? product?.averageRating ?? 0
  );
  const showRating = Number.isFinite(ratingValue) && ratingValue > 0;
  const rounded = Math.round(ratingValue);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/auth/login", {
        state: { from: location.pathname + location.search },
        replace: false,
      });
      return;
    }

    dispatch(addToCart(product));
  };

  const productId = product?._id || product?.id;

  return (
    <li className={css.card}>
      {/* клікабельна зона → переходить на сторінку товару */}
      <Link
        to={productId ? `/catalog/${productId}` : "#"}
        className={css.cardLink}
        state={{ from: location.pathname + location.search }}
      >
        <div className={css.imageWrap}>
          {mainImage ? (
            <img
              src={mainImage}
              alt={product?.name || "product"}
              className={css.image}
              loading="lazy"
            />
          ) : (
            <div className={css.imagePlaceholder} />
          )}
        </div>

        <div className={css.content}>
          <ProductDetail product={product} />

          <div className={css.metaRow}>
            <span className={css.price}>{price}</span>

            {showRating && (
              <span className={css.rating} aria-label={`Rating ${ratingValue}`}>
                <span className={css.stars} aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`${css.star} ${i < rounded ? css.starOn : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </span>
                <span className={css.ratingValue}>
                  {ratingValue.toFixed(1)}
                </span>
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* окрема кнопка, яка не веде на деталі, тільки додає в кошик */}
      <button type="button" className={css.cartBtn} onClick={handleAddToCart}>
        Add to cart
      </button>
    </li>
  );
};

export default CatalogItem;
