import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import css from "./ProductCreateForm.module.css";
import { createProductThunk } from "../../redux/operations/productOperations";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Мінімум 2 символи")
    .max(100, "Максимум 100 символів")
    .required("Обов'язкове поле"),
  description: Yup.string().max(1000, "Максимум 1000 символів").nullable(),
  price: Yup.number()
    .typeError("Має бути числом")
    .min(0, "Не може бути менше 0")
    .required("Обов'язкове поле"),
  category: Yup.string().required("Оберіть категорію"),
  length: Yup.string().required("Вкажіть довжину виробу"),
  beadSize: Yup.string().required("Вкажіть розмір намистин"),
  countInStock: Yup.number()
    .typeError("Має бути числом")
    .integer("Має бути цілим числом")
    .min(0, "Не може бути менше 0")
    .required("Обов'язкове поле"),
});

const initialValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  length: "",
  beadSize: "",
  countInStock: "",
  images: [],
};

const splitValues = (value) => {
  if (!value) return [];

  return String(value)
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const ProductCreateForm = () => {
  const dispatch = useDispatch();
  const [previewItems, setPreviewItems] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const previewRef = useRef([]);

  useEffect(() => {
    previewRef.current = previewItems;
  }, [previewItems]);

  useEffect(() => {
    setPreviewUrl(previewItems[0]?.url || null);
  }, [previewItems]);

  useEffect(() => {
    return () => {
      previewRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("price", String(values.price));
      formData.append("category", values.category);

      const lengthValues = splitValues(values.length);
      lengthValues.forEach((value) => formData.append("length", value));

      const beadSizeValues = splitValues(values.beadSize);
      beadSizeValues.forEach((value) => formData.append("beadSize", value));

      const count = Number(values.countInStock) || 0;
      formData.append("countInStock", String(count));
      formData.append("inStock", String(count > 0));

      if (Array.isArray(values.images) && values.images.length > 0) {
        values.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      await dispatch(createProductThunk(formData)).unwrap();

      toast.success("Товар успішно створено");

      previewRef.current.forEach((item) => URL.revokeObjectURL(item.url));
      setPreviewItems([]);
      resetForm();
    } catch (error) {
      console.error("Create product error:", error);
      toast.error(error?.message || "Не вдалося створити товар");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={css.wrapper}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => {
          const syncFiles = (items) => {
            const files = items.map((item) => item.file);
            setFieldValue("images", files);
          };

          const handleFilesSelected = (event) => {
            const files = Array.from(event.currentTarget.files || []);
            if (!files.length) return;

            const newItems = files.map((file) => ({
              id: `${file.name}-${file.lastModified}-${file.size}`,
              file,
              url: URL.createObjectURL(file),
            }));

            setPreviewItems((prev) => {
              const mergedMap = new Map(prev.map((item) => [item.id, item]));

              newItems.forEach((item) => {
                if (mergedMap.has(item.id)) {
                  URL.revokeObjectURL(item.url);
                } else {
                  mergedMap.set(item.id, item);
                }
              });

              const nextItems = Array.from(mergedMap.values());
              syncFiles(nextItems);
              return nextItems;
            });

            event.target.value = "";
          };

          const handleRemoveImage = (id) => {
            setPreviewItems((prev) => {
              const removedItem = prev.find((item) => item.id === id);
              const nextItems = prev.filter((item) => item.id !== id);

              if (removedItem) {
                URL.revokeObjectURL(removedItem.url);
              }

              syncFiles(nextItems);
              return nextItems;
            });
          };

          const clearAll = () => {
            previewRef.current.forEach((item) => URL.revokeObjectURL(item.url));
            setPreviewItems([]);
            setFieldValue("images", []);
            setPreviewUrl(null);
          };

          return (
            <Form className={css.form}>
              <div className={css.generalSection}>
                <h2 className={css.sectionTitle}>Загальна інформація</h2>

                <div className={css.fieldGroup}>
                  <label htmlFor="name" className={css.label}>
                    Назва товару
                  </label>
                  <Field
                    id="name"
                    name="name"
                    placeholder="Введіть назву товару"
                    className={css.input}
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className={css.error}
                  />
                </div>

                <div className={css.fieldGroup}>
                  <label htmlFor="description" className={css.label}>
                    Опис товару
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    placeholder="Коротко опишіть товар"
                    className={`${css.input} ${css.textarea}`}
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className={css.error}
                  />
                </div>

                <div className={css.fieldRow}>
                  <div className={css.fieldGroup}>
                    <label htmlFor="price" className={css.label}>
                      Ціна ($)
                    </label>
                    <Field
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className={css.input}
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className={css.error}
                    />
                  </div>

                  <div className={css.fieldGroup}>
                    <label htmlFor="countInStock" className={css.label}>
                      Кількість на складі
                    </label>
                    <Field
                      id="countInStock"
                      name="countInStock"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      className={css.input}
                    />
                    <ErrorMessage
                      name="countInStock"
                      component="div"
                      className={css.error}
                    />
                  </div>
                </div>

                <div className={css.fieldGroup}>
                  <label htmlFor="category" className={css.label}>
                    Категорія
                  </label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className={css.input}
                  >
                    <option value="">Оберіть категорію</option>
                    <option value="necklace">Намисто</option>
                    <option value="bracelet">Браслети</option>
                    <option value="earrings">Сережки</option>
                    <option value="other">Інше</option>
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className={css.error}
                  />
                </div>

                <div className={css.fieldRow}>
                  <div className={css.fieldGroup}>
                    <label htmlFor="length" className={css.label}>
                      Довжина виробу
                    </label>
                    <Field
                      id="length"
                      name="length"
                      placeholder="Наприклад: 18 см"
                      className={css.input}
                      autoComplete="off"
                    />
                    <p className={css.fieldHint}>
                      Вкажіть кілька довжин через кому або з нового рядка.
                    </p>
                    <ErrorMessage
                      name="length"
                      component="div"
                      className={css.error}
                    />
                  </div>

                  <div className={css.fieldGroup}>
                    <label htmlFor="beadSize" className={css.label}>
                      Розмір намистин
                    </label>
                    <Field
                      id="beadSize"
                      name="beadSize"
                      placeholder="Наприклад: 6 мм"
                      className={css.input}
                      autoComplete="off"
                    />
                    <p className={css.fieldHint}>
                      Вкажіть усі доступні розміри намистин через кому.
                    </p>
                    <ErrorMessage
                      name="beadSize"
                      component="div"
                      className={css.error}
                    />
                  </div>
                </div>
              </div>

              <div className={css.sideSection}>
                <h2 className={css.sectionTitle}>Фото товару</h2>

                <div className={css.previewFrame}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Попередній перегляд"
                      className={css.imagePreview}
                    />
                  ) : (
                    <div className={css.imagePlaceholder}>
                      Додайте фото, щоб побачити превʼю
                    </div>
                  )}
                </div>

                {previewItems.length > 0 && (
                  <div className={css.gallerySection}>
                    <div className={css.galleryHeader}>
                      <span>Обрані фото</span>
                      <button
                        type="button"
                        className={css.clearBtn}
                        onClick={clearAll}
                      >
                        Скинути
                      </button>
                    </div>

                    <div className={css.thumbGrid}>
                      {previewItems.map((item, index) => (
                        <div key={item.id} className={css.thumbItem}>
                          <button
                            type="button"
                            className={`${css.thumbBtn} ${
                              previewUrl === item.url ? css.thumbActive : ""
                            }`}
                            onClick={() => setPreviewUrl(item.url)}
                          >
                            <span className={css.previewBadge}>
                              #{index + 1}
                            </span>
                            <img
                              src={item.url}
                              alt={`Превʼю ${index + 1}`}
                              className={css.thumbImg}
                            />
                          </button>

                          <button
                            type="button"
                            className={css.thumbRemove}
                            onClick={() => handleRemoveImage(item.id)}
                            aria-label="Видалити фото"
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
                    onChange={handleFilesSelected}
                  />
                </label>

                <button
                  type="submit"
                  className={css.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Збереження..." : "Опублікувати товар"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProductCreateForm;
