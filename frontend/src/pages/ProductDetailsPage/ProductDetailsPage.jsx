import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import css from "./ProductDetailsPage.module.css";

import Loader from "../../components/Loader/Loader";
import ProductGallery from "../../components/ProductDetails/ProductGallery/ProductGallery";
import ProductInfo from "../../components/ProductDetails/ProductInfo/ProductInfo";
import ProductTabs from "../../components/ProductDetails/ProductTabs/ProductTabs";
import RelatedProducts from "../../components/ProductDetails/RelatedProducts/RelatedProducts";

import {
  selectCurrentProduct,
  selectProducts,
  selectProductsError,
  selectProductsLoading,
} from "../../redux/selectors/productSelectors";
import {
  fetchProductByIdThunk,
  fetchProductsThunk,
} from "../../redux/operations/productOperations";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const product = useSelector(selectCurrentProduct);
  const related = useSelector(selectProducts);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    if (!productId) return;
    dispatch(fetchProductByIdThunk(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    if (!product || !product.category) return;

    dispatch(
      fetchProductsThunk({
        page: 1,
        perPage: 4,
        category: product.category,
      })
    );
  }, [dispatch, product]);

  const images = useMemo(() => {
    return [
      product?.image,
      ...(Array.isArray(product?.images) ? product.images : []),
    ]
      .filter(Boolean)
      .filter((val, idx, arr) => arr.indexOf(val) === idx);
  }, [product]);

  if (isLoading && !product) {
    return (
      <div className={css.loaderWrap}>
        <Loader />
      </div>
    );
  }

  if (error && !product) {
    return (
      <section className={css.page}>
        <div className={css.container}>
          <p className={css.error}>
            {typeof error === "string"
              ? error
              : "Unable to load product details."}
          </p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className={css.page}>
        <div className={css.container}>
          <p className={css.error}>Product cannot be loaded.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={css.page}>
      <div className={css.container}>
        <div className={css.breadcrumb}>
          <Link className={css.breadcrumbLink} to="/">
            Home
          </Link>
          <span className={css.breadcrumbDivider}>›</span>
          <Link className={css.breadcrumbLink} to="/catalog">
            Catalog
          </Link>

          {product.category ? (
            <>
              <span className={css.breadcrumbDivider}>›</span>
              <span className={css.breadcrumbLinkMuted}>
                {product.category}
              </span>
            </>
          ) : null}

          <span className={css.breadcrumbDivider}>›</span>
          <span className={css.breadcrumbCurrent}>
            {product.name || "Product"}
          </span>
        </div>

        <div className={css.productGrid}>
          <div className={css.leftCol}>
            <ProductGallery images={images} />
          </div>

          <div className={css.rightCol}>
            <ProductInfo product={product} />
          </div>
        </div>

        <div className={css.tabsRow} id="product-details-tabs">
          <ProductTabs product={product} />
        </div>

        {Array.isArray(related) && related.length > 0 ? (
          <div className={css.relatedRow}>
            <RelatedProducts
              products={related}
              currentId={product._id || product.id}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProductDetailsPage;
