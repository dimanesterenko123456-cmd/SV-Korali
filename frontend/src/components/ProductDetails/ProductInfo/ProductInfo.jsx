import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal } from "react-icons/fa";
import { FiMinus, FiPlus, FiShield } from "react-icons/fi";

import css from "./ProductInfo.module.css";
import { addToCart } from "../../../redux/slices/cartSlice";
import { selectAccessToken } from "../../../redux/selectors/authSelectors";

const MATERIAL_LABELS = {
  coral: "Coral",
  "seed-beads": "Seed beads",
  glass: "Glass",
  ceramic: "Ceramic",
  "natural-stone": "Natural stone",
  pearl: "Mother of Pearl",
  "mother-of-pearl": "Mother of Pearl",
  wood: "Wood",
  metal: "Metal",
  mixed: "Mixed",
  other: "Other",
};

const formatMaterials = (value) => {
  const materials = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  const labels = materials
    .map((material) => String(material).trim())
    .filter(Boolean)
    .map((material) => MATERIAL_LABELS[material] || material);

  return labels.length ? labels.join(", ") : "Natural coral";
};

// const normalizeOptions = (value) => {
//   if (Array.isArray(value)) {
//     return value
//       .map((item) => (typeof item === "string" ? item : String(item)))
//       .map((item) => item.trim())
//       .filter(Boolean);
//   }

//   if (typeof value === "string") {
//     return value
//       .split(/[,\n]/)
//       .map((item) => item.trim())
//       .filter(Boolean);
//   }

//   return [];
// };

const ProductInfo = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = useSelector(selectAccessToken);
  const isLoggedIn = Boolean(accessToken);

  const name = product?.name || "Product";
  const category = product?.category || "";
  const sku = product?.sku || product?._id || product?.id;

  const rawPrice = product?.price;
  const priceNumber = Number(rawPrice);
  const price =
    rawPrice != null && rawPrice !== ""
      ? Number.isFinite(priceNumber)
        ? `$${priceNumber.toFixed(0)}`
        : `$${rawPrice}`
      : "—";

  const compareAt = product?.compareAtPrice ?? product?.oldPrice ?? null;
  const compareAtNumber = Number(compareAt);
  const showCompareAt =
    Number.isFinite(compareAtNumber) &&
    Number.isFinite(priceNumber) &&
    compareAtNumber > priceNumber;

  const discount = useMemo(() => {
    if (!showCompareAt) return null;
    const pct = Math.round(
      ((compareAtNumber - priceNumber) / compareAtNumber) * 100,
    );
    return Number.isFinite(pct) ? pct : null;
  }, [showCompareAt, compareAtNumber, priceNumber]);

  const inStock =
    product?.inStock ??
    (typeof product?.countInStock === "number"
      ? product.countInStock > 0
      : true);

  const stockLeft =
    typeof product?.countInStock === "number" ? product.countInStock : null;
  const availableToOrder = Boolean(product?.availableToOrder);
  const materialsText = formatMaterials(product?.materials);

  const ratingValue = Number(
    product?.rating ?? product?.avgRating ?? product?.averageRating ?? 0,
  );
  const showRating = Number.isFinite(ratingValue) && ratingValue > 0;

  const reviewsCount = Number(
    product?.reviewsCount ?? product?.numReviews ?? 0,
  );
  const showReviewsCount = Number.isFinite(reviewsCount) && reviewsCount > 0;

  const descriptionText = useMemo(() => {
    const raw = product?.description;
    if (!raw) return [];

    const parts = String(raw)
      .split(/\n{2,}/g)
      .map((p) => p.trim())
      .filter(Boolean);

    return parts.length ? parts : [String(raw).trim()];
  }, [product?.description]);

  // const lengthOptions = useMemo(
  //   () => normalizeOptions(product?.length),
  //   [product?.length]
  // );

  // const beadSizeOptions = useMemo(
  //   () => normalizeOptions(product?.beadSize),
  //   [product?.beadSize]
  // );

  // const [length, setLength] = useState(() => lengthOptions[0] || "");
  // const [beadSize, setBeadSize] = useState(() => beadSizeOptions[0] || "");
  const [qty, setQty] = useState(1);

  // useEffect(() => {
  //   setLength((prev) =>
  //     lengthOptions.length
  //       ? lengthOptions.includes(prev)
  //         ? prev
  //         : lengthOptions[0]
  //       : ""
  //   );
  // }, [lengthOptions]);

  // useEffect(() => {
  //   setBeadSize((prev) =>
  //     beadSizeOptions.length
  //       ? beadSizeOptions.includes(prev)
  //         ? prev
  //         : beadSizeOptions[0]
  //       : ""
  //   );
  // }, [beadSizeOptions]);

  const inc = () => {
    const max = typeof stockLeft === "number" ? Math.max(stockLeft, 1) : 99;
    setQty((q) => (q < max ? q + 1 : q));
  };

  const dec = () => {
    setQty((q) => (q > 1 ? q - 1 : q));
  };

  const requireAuth = () => {
    if (isLoggedIn) return true;
    navigate("/auth/login", {
      state: { from: location.pathname + location.search },
    });
    return false;
  };

  const handleAddToCart = () => {
    if (!requireAuth()) return;
    if (!inStock) return;
    const payload = { ...product, quantity: qty };
    // if (length) payload.length = length;
    // if (beadSize) payload.beadSize = beadSize;
    dispatch(addToCart(payload));
  };

  const handleBuyNow = () => {
    if (!requireAuth()) return;
    if (!inStock) return;
    const payload = { ...product, quantity: qty };
    // if (length) payload.length = length;
    // if (beadSize) payload.beadSize = beadSize;
    dispatch(addToCart(payload));
    navigate("/cart");
  };

  return (
    <section className={css.info}>
      <div className={css.headRow}>
        {category ? <span className={css.pill}>{category}</span> : <span />}
      </div>

      <h1 className={css.title}>{name}</h1>

      {showRating ? (
        <div className={css.ratingRow}>
          <div
            className={css.stars}
            aria-label={`Rating ${ratingValue.toFixed(1)}`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`${css.star} ${
                  i < Math.round(ratingValue) ? css.starOn : ""
                }`}
              >
                ★
              </span>
            ))}
          </div>
          {showReviewsCount ? (
            <span className={css.reviews}>({reviewsCount} reviews)</span>
          ) : null}
        </div>
      ) : null}

      <div className={css.priceRow}>
        <span className={css.price}>{price}</span>
        {showCompareAt ? (
          <span className={css.oldPrice}>${compareAtNumber.toFixed(0)}</span>
        ) : null}
        {discount ? (
          <span className={css.discount}>{discount}% OFF</span>
        ) : null}

        <span
          className={`${css.stock} ${inStock ? css.inStock : css.outStock}`}
        >
          {inStock ? "In stock" : "Out of stock"}
        </span>
      </div>

      {!inStock && availableToOrder ? (
        <div className={css.orderNotice}>
          <span className={css.orderNoticeTitle}>Available by special order</span>
          <span className={css.orderNoticeText}>
            This piece can be made to order even though it is currently out of
            stock.
          </span>
        </div>
      ) : null}

      {descriptionText.length ? (
        <div className={css.shortDesc}>
          {descriptionText.map((text, idx) => (
            <p key={idx} className={css.shortDescP}>
              {text}
            </p>
          ))}
        </div>
      ) : null}

      <div className={css.options}>
        {/* {lengthOptions.length ? (
          <div className={css.optionBlock}>
            <h3 className={css.optionTitle}>Length</h3>
            <div className={css.optionGrid}>
              {lengthOptions.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`${css.optBtn} ${
                    length === v ? css.optBtnActive : ""
                  }`}
                  onClick={() => setLength(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {beadSizeOptions.length ? (
          <div className={css.optionBlock}>
            <h3 className={css.optionTitle}>Bead Size</h3>
            <div className={css.optionGrid}>
              {beadSizeOptions.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`${css.optBtn} ${
                    beadSize === v ? css.optBtnActive : ""
                  }`}
                  onClick={() => setBeadSize(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ) : null} */}

        <div className={css.optionBlock}>
          <h3 className={css.optionTitle}>Quantity</h3>
          <div className={css.qtyRow}>
            <div className={css.qtyBox}>
              <button
                type="button"
                className={css.qtyBtn}
                onClick={dec}
                aria-label="Decrease"
              >
                <FiMinus />
              </button>

              <input
                className={css.qtyInput}
                value={qty}
                readOnly
                aria-label="Quantity"
              />

              <button
                type="button"
                className={css.qtyBtn}
                onClick={inc}
                aria-label="Increase"
              >
                <FiPlus />
              </button>
            </div>

            {typeof stockLeft === "number" ? (
              <span className={css.qtyHint}>
                Only {stockLeft} left in stock
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.primary}
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          Add to Cart
        </button>

        <button
          type="button"
          className={css.secondary}
          onClick={handleBuyNow}
          disabled={!inStock}
        >
          Buy Now
        </button>
      </div>

      <div className={css.detailsCard}>
        <h3 className={css.detailsTitle}>Product Details</h3>
        <div className={css.detailsGrid}>
          {sku ? (
            <div className={css.detailItem}>
              <span className={css.detailLabel}>SKU:</span>
              <span className={css.detailValue}>{String(sku)}</span>
            </div>
          ) : null}

          {category ? (
            <div className={css.detailItem}>
              <span className={css.detailLabel}>Category:</span>
              <span className={css.detailValue}>{category}</span>
            </div>
          ) : null}

          <div className={css.detailItem}>
            <span className={css.detailLabel}>Material:</span>
            <span className={css.detailValue}>{materialsText}</span>
          </div>

          <div className={css.detailItem}>
            <span className={css.detailLabel}>Origin:</span>
            <span className={css.detailValue}>
              {product?.origin || "Ukraine"}
            </span>
          </div>
        </div>
      </div>

      <div className={css.trust}>
        <FaCcVisa />
        <FaCcMastercard />
        <FaCcAmex />
        <FaPaypal />
        <FiShield />
      </div>
    </section>
  );
};

export default ProductInfo;
