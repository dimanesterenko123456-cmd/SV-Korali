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

  // ✅ було stock -> тепер countInStock
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
  // ✅ було stock -> тепер countInStock
  countInStock: "",
  image: null,
  images: [],
};

const ProductCreateForm = () => {
  const dispatch = useDispatch();
  const [previewItems, setPreviewItems] = useState([]);
  const previewRef = useRef([]);

  useEffect(() => {
    previewRef.current = previewItems;
  }, [previewItems]);

  useEffect(
    () => () => {
      previewRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    },
    []
  );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("price", values.price);
      formData.append("category", values.category);

      // ✅ бекенд очікує countInStock + (опційно) inStock
      const count = Number(values.countInStock) || 0;
      formData.append("countInStock", String(count));
      formData.append("inStock", String(count > 0));

      if (Array.isArray(values.images) && values.images.length > 0) {
        values.images.forEach((file) => {
          if (file) formData.append("images", file);
        });

        if (values.images[0]) {
          formData.append("image", values.images[0]);
        }
      } else if (values.image) {
        formData.append("image", values.image);
      }

      await dispatch(createProductThunk(formData)).unwrap();

      toast.success("Товар успішно створено");
      previewItems.forEach((item) => URL.revokeObjectURL(item.url));
      resetForm();
      setPreviewItems([]);
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
            const filesToSubmit = items.map((item) => item.file);
            setFieldValue("images", filesToSubmit);
            setFieldValue("image", filesToSubmit[0] || null);
          };

          const handleFilesSelected = (event) => {
            const files = Array.from(event.currentTarget.files || []);
            if (!files.length) return;

            const incoming = files.map((file) => ({
              id: `${file.name}-${file.lastModified}-${file.size}`,
              file,
              url: URL.createObjectURL(file),
            }));

            const mergedMap = new Map(
              previewItems.map((item) => [item.id, item])
            );

            incoming.forEach((item) => {
              if (mergedMap.has(item.id)) {
                URL.revokeObjectURL(item.url);
              } else {
                mergedMap.set(item.id, item);
              }
            });

            const nextItems = Array.from(mergedMap.values());
            setPreviewItems(nextItems);
            syncFiles(nextItems);

            event.target.value = "";
          };

          const handleRemoveImage = (id) => {
            setPreviewItems((prev) => {
              const next = prev.filter((item) => item.id !== id);
              const removed = prev.find((item) => item.id === id);
              if (removed) URL.revokeObjectURL(removed.url);
              syncFiles(next);
              return next;
            });
          };

          const clearAll = () => {
            previewItems.forEach((item) => URL.revokeObjectURL(item.url));
            setPreviewItems([]);
            setFieldValue("images", []);
            setFieldValue("image", null);
          };

          return (
            <Form className={css.form}>
              {/* ліва колонка */}
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
              </div>

              {/* права колонка */}
              <div className={css.sideSection}>
                <h2 className={css.sectionTitle}>Фото товару</h2>

                <label className={css.uploadBox}>
                  {previewItems.length > 0 ? (
                    <div className={css.previewGrid}>
                      {previewItems.map((item, index) => (
                        <div key={item.id} className={css.previewItem}>
                          <img
                            src={item.url}
                            alt={`Превʼю ${index + 1}`}
                            className={css.previewImage}
                          />
                          <span className={css.previewBadge}>#{index + 1}</span>
                          <button
                            type="button"
                            className={css.previewRemove}
                            onClick={() => handleRemoveImage(item.id)}
                            aria-label="Видалити фото"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className={css.uploadPlaceholder}>
                      <span className={css.uploadIcon}>+</span>
                      <span>Натисніть, щоб завантажити фото</span>
                      <span className={css.uploadHint}>
                        Можна вибрати кілька файлів
                      </span>
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className={css.fileInput}
                    onChange={handleFilesSelected}
                  />
                </label>

                {previewItems.length > 0 && (
                  <div className={css.fileChips}>
                    {previewItems.map((item) => (
                      <span key={item.id} className={css.fileChip}>
                        {item.file.name}
                        <button
                          type="button"
                          className={css.fileChipRemove}
                          onClick={() => handleRemoveImage(item.id)}
                          aria-label="Прибрати фото"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    <button
                      type="button"
                      className={css.resetUploads}
                      onClick={clearAll}
                    >
                      Очистити вибір
                    </button>
                  </div>
                )}

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
