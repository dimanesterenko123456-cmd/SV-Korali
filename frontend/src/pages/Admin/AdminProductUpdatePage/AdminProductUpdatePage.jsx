import { useEffect, useRef, useState } from "react";
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
  const [imageFiles, setImageFiles] = useState([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const newPreviewRef = useRef([]);

  // const joinValues = (value) => {
  //   if (Array.isArray(value)) {
  //     return value.join(", ");
  //   }

  //   return value || "";
  // };

  // const splitValues = (value) => {
  //   if (!value) return [];
  //   return String(value)
  //     .split(/[,\n]/)
  //     .map((item) => item.trim())
  //     .filter(Boolean);
  // };

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
      // length: joinValues(product.length),
      // beadSize: joinValues(product.beadSize),
      countInStock:
        typeof product.countInStock === "number" ? product.countInStock : 0,
      inStock:
        typeof product.inStock === "boolean"
          ? product.inStock
          : (product.countInStock || 0) > 0,
      availableToOrder: Boolean(product.availableToOrder),
    });

    const gallery = [];

    if (product.image) {
      gallery.push(product.image);
    }

    if (Array.isArray(product.images)) {
      gallery.push(...product.images);
    }

    const uniqueGallery = Array.from(new Set(gallery.filter(Boolean)));

    setImageFiles([]);
    setNewPreviewUrls([]);
    setExistingImages(uniqueGallery);
    setPreviewUrl(uniqueGallery[0] || null);
  }, [product]);

  useEffect(() => {
    newPreviewRef.current = newPreviewUrls;
  }, [newPreviewUrls]);

  useEffect(
    () => () => {
      newPreviewRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

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
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const nextFiles = [...imageFiles];
    const nextUrls = [...newPreviewUrls];

    files.forEach((file) => {
      const exists = nextFiles.some(
        (item) =>
          item.name === file.name &&
          item.size === file.size &&
          item.lastModified === file.lastModified,
      );

      if (!exists) {
        nextFiles.push(file);
        nextUrls.push(URL.createObjectURL(file));
      }
    });

    setImageFiles(nextFiles);
    setNewPreviewUrls(nextUrls);

    if (nextUrls[0]) {
      setPreviewUrl(nextUrls[0]);
    } else if (existingImages[0]) {
      setPreviewUrl(existingImages[0]);
    }

    e.target.value = "";
  };
  const removeExistingImage = (img) => {
    setExistingImages((prev) => {
      const next = prev.filter((item) => item !== img);
      setPreviewUrl((current) => {
        if (current === img) {
          return next[0] || newPreviewUrls[0] || null;
        }
        return current;
      });
      return next;
    });
  };

  const removeNewImage = (index) => {
    setNewPreviewUrls((prevUrls) => {
      const removedUrl = prevUrls[index];
      if (removedUrl) {
        URL.revokeObjectURL(removedUrl);
      }

      const nextUrls = prevUrls.filter((_, i) => i !== index);
      setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      setPreviewUrl((current) => {
        if (current === removedUrl) {
          return nextUrls[0] || existingImages[0] || null;
        }

        if (!current) {
          return nextUrls[0] || existingImages[0] || null;
        }

        return current;
      });

      return nextUrls;
    });
  };

  const clearNewImages = () => {
    newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setNewPreviewUrls([]);
    setPreviewUrl(existingImages[0] || null);
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
      // const lengthValues = splitValues(formValues.length);
      // if (lengthValues.length) {
      //   lengthValues.forEach((val) => formData.append("length", val));
      // } else {
      //   formData.append("length", "");
      // }
      // const beadSizeValues = splitValues(formValues.beadSize);
      // if (beadSizeValues.length) {
      //   beadSizeValues.forEach((val) => formData.append("beadSize", val));
      // } else {
      //   formData.append("beadSize", "");
      // }

      formData.append("countInStock", formValues.countInStock);
      formData.append("inStock", String(formValues.inStock));
      formData.append(
        "availableToOrder",
        String(formValues.availableToOrder),
      );

      const galleryToKeep = existingImages.filter(Boolean);

      galleryToKeep.forEach((img) => formData.append("images", img));

      if (imageFiles.length) {
        imageFiles.forEach((file) => formData.append("images", file));
        formData.append("image", imageFiles[0]);
      } else if (galleryToKeep[0]) {
        formData.append("image", galleryToKeep[0]);
      }

      await dispatch(
        updateProductThunk({ id: productId, payload: formData }),
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
              {/* <div className={css.row2}>
                <div className={css.field}>
                  <label className={css.label}>Length</label>
                  <input
                    type="text"
                    name="length"
                    className={css.input}
                    value={formValues.length}
                    onChange={handleChange}
                    placeholder="18 cm"
                  />
                  <p className={css.hint}>
                    Додайте кілька довжин через кому або з нового рядка.
                  </p>
                </div>

                <div className={css.field}>
                  <label className={css.label}>Bead size</label>
                  <input
                    type="text"
                    name="beadSize"
                    className={css.input}
                    value={formValues.beadSize}
                    onChange={handleChange}
                    placeholder="6 mm"
                  />
                  <p className={css.hint}>
                    Перерахуйте всі доступні розміри намистин через кому.
                  </p>
                </div>
              </div> */}
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

              <div className={css.fieldCheckbox}>
                <label className={css.label}>Made to order</label>
                <label className={css.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="availableToOrder"
                    checked={formValues.availableToOrder}
                    onChange={handleChange}
                  />
                  <span>
                    Show that this product can be made to order when out of
                    stock
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={css.rightCol}>
            <div className={css.card}>
              <h2 className={css.cardTitle}>Product images</h2>

              <div className={css.previewFrame}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={formValues.name}
                    className={css.imagePreview}
                  />
                ) : (
                  <div className={css.imagePlaceholder}>No image selected</div>
                )}
              </div>

              {existingImages.length > 0 && (
                <div className={css.gallerySection}>
                  <div className={css.galleryHeader}>
                    <span>Поточні фото</span>
                    <span className={css.badge}>{existingImages.length}</span>
                  </div>

                  <div className={css.thumbGrid}>
                    {existingImages.map((img) => (
                      <div key={img} className={css.thumbItem}>
                        <button
                          type="button"
                          className={`${css.thumbBtn} ${
                            previewUrl === img ? css.thumbActive : ""
                          }`}
                          onClick={() => setPreviewUrl(img)}
                        >
                          <img
                            src={img}
                            alt="gallery"
                            className={css.thumbImg}
                          />
                        </button>

                        <button
                          type="button"
                          className={css.thumbRemove}
                          onClick={() => removeExistingImage(img)}
                          aria-label="Прибрати фото"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className={css.imageUpload}>
                <div className={css.uploadCopy}>
                  <span className={css.uploadIcon}>+</span>
                  <span>Додати нові фото (можна кілька)</span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className={css.fileInput}
                  onChange={handleImageChange}
                />
              </label>
              {newPreviewUrls.length > 0 && (
                <div className={css.newUploads}>
                  <div className={css.galleryHeader}>
                    <span>Нові фото</span>
                    <button
                      type="button"
                      className={css.clearBtn}
                      onClick={clearNewImages}
                    >
                      Скинути
                    </button>
                  </div>

                  <div className={css.thumbGrid}>
                    {newPreviewUrls.map((url, idx) => (
                      <div key={url} className={css.thumbItem}>
                        <div className={css.thumbBtn}>
                          <span className={css.previewBadge}>#{idx + 1}</span>
                          <img src={url} alt="new" className={css.thumbImg} />
                        </div>

                        <button
                          type="button"
                          className={css.thumbRemove}
                          onClick={() => removeNewImage(idx)}
                          aria-label="Видалити фото"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
