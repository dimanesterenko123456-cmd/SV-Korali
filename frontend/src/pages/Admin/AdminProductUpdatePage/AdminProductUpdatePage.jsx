import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import css from "./AdminProductUpdatePage.module.css";

import Loader from "../../../components/Loader/Loader";
import {
  selectCurrentProduct,
  selectProductsError,
  selectProductsLoading,
} from "../../../redux/selectors/productSelectors";
import {
  deleteProductThunk,
  fetchProductByIdThunk,
  updateProductThunk,
} from "../../../redux/operations/productOperations";

const AdminProductUpdatePage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector(selectCurrentProduct);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const [formValues, setFormValues] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // завантажуємо продукт
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductByIdThunk(productId));
    }
  }, [dispatch, productId]);

  // коли продукт прийшов — заповнюємо форму
  useEffect(() => {
    if (!product) return;

    setFormValues({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      countInStock:
        typeof product.countInStock === "number" ? product.countInStock : 0,
      inStock:
        typeof product.inStock === "boolean"
          ? product.inStock
          : (product.countInStock || 0) > 0,
    });

    const mainImage =
      product.image ||
      (Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : null);

    setPreviewUrl(mainImage);
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
      <div className={css.page}>
        <div className={css.inner}>
          <p className={css.error}>
            {typeof error === "string" ? error : "Failed to load product"}
          </p>
          <Link to="/admin/products" className={css.backLink}>
            ← Back to products
          </Link>
        </div>
      </div>
    );
  }

  if (!formValues) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "countInStock"
          ? value
          : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", formValues.name);
      if (formValues.description) {
        formData.append("description", formValues.description);
      }
      formData.append("price", formValues.price);
      formData.append("category", formValues.category);
      formData.append("countInStock", formValues.countInStock);
      formData.append("inStock", String(formValues.inStock));

      if (imageFile) {
        // бек приймає або req.file, або req.files; назву поля можеш змінити
        formData.append("image", imageFile);
      }

      await dispatch(
        updateProductThunk({ id: productId, payload: formData })
      ).unwrap();

      // після оновлення вертаємось до списку
      navigate("/admin/products");
    } catch (err) {
      console.error("Update product error:", err);
      // тут можна додати toast
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Видалити цей товар?");
    if (!ok) return;

    try {
      await dispatch(deleteProductThunk(productId)).unwrap();
      navigate("/admin/products");
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  return (
    <section className={css.page}>
      <div className={css.inner}>
        {/* breadcrumb / top actions */}
        <div className={css.topRow}>
          <div className={css.breadcrumb}>
            <Link to="/admin/products" className={css.breadcrumbLink}>
              Products
            </Link>
            <span className={css.breadcrumbSeparator}>/</span>
            <span className={css.breadcrumbCurrent}>
              {product?.name || "Edit product"}
            </span>
          </div>

          <div className={css.topActions}>
            <button
              type="button"
              className={css.btnGhost}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={css.btnDanger}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>

        {/* main grid */}
        <form className={css.grid} onSubmit={handleSubmit}>
          {/* LEFT COLUMN */}
          <div className={css.leftCol}>
            {/* Basic info */}
            <div className={css.card}>
              <h2 className={css.cardTitle}>Basic information</h2>

              <div className={css.field}>
                <label className={css.label}>Product name</label>
                <input
                  type="text"
                  name="name"
                  className={css.input}
                  value={formValues.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={css.field}>
                <label className={css.label}>Description</label>
                <textarea
                  name="description"
                  rows="4"
                  className={`${css.input} ${css.textarea}`}
                  value={formValues.description}
                  onChange={handleChange}
                />
              </div>

              <div className={css.row2}>
                <div className={css.field}>
                  <label className={css.label}>Category</label>
                  <select
                    name="category"
                    className={css.input}
                    value={formValues.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose category</option>
                    <option value="necklace">Necklaces</option>
                    <option value="bracelet">Bracelets</option>
                    <option value="earrings">Earrings</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={css.fieldCheckbox}>
                  <label className={css.label}>Active / in stock</label>
                  <label className={css.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formValues.inStock}
                      onChange={handleChange}
                    />
                    <span>Product available for purchase</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Pricing & stock */}
            <div className={css.card}>
              <h2 className={css.cardTitle}>Pricing & inventory</h2>

              <div className={css.row2}>
                <div className={css.field}>
                  <label className={css.label}>Price, $</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="price"
                    className={css.input}
                    value={formValues.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={css.field}>
                  <label className={css.label}>Stock quantity</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    name="countInStock"
                    className={css.input}
                    value={formValues.countInStock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={css.rightCol}>
            <div className={css.card}>
              <h2 className={css.cardTitle}>Product image</h2>

              <label className={css.imageUpload}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={formValues.name}
                    className={css.imagePreview}
                  />
                ) : (
                  <span className={css.imagePlaceholder}>
                    Click to upload image
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className={css.fileInput}
                  onChange={handleImageChange}
                />
              </label>

              <p className={css.hint}>Recommended: 800×800px, JPG or PNG.</p>
            </div>

            <div className={css.card}>
              <h2 className={css.cardTitle}>Status</h2>
              <p className={css.statusRow}>
                <span className={css.statusLabel}>ID</span>
                <span className={css.statusValue}>{product?._id}</span>
              </p>
              <p className={css.statusRow}>
                <span className={css.statusLabel}>Created</span>
                <span className={css.statusValue}>
                  {product?.createdAt
                    ? new Date(product.createdAt).toLocaleString()
                    : "—"}
                </span>
              </p>
              <p className={css.statusRow}>
                <span className={css.statusLabel}>Updated</span>
                <span className={css.statusValue}>
                  {product?.updatedAt
                    ? new Date(product.updatedAt).toLocaleString()
                    : "—"}
                </span>
              </p>
            </div>

            <div className={css.actionsCard}>
              <button
                type="button"
                className={css.btnGhost}
                onClick={() => navigate("/admin/products")}
              >
                Back to list
              </button>
              <button
                type="submit"
                className={css.btnPrimary}
                disabled={saving}
              >
                {saving ? "Saving..." : "Update product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminProductUpdatePage;
