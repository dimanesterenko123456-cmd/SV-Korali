import { useState } from "react";
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
};

const ProductCreateForm = () => {
  const dispatch = useDispatch();
  const [previewUrl, setPreviewUrl] = useState(null);

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

      if (values.image) {
        formData.append("image", values.image);
      }

      await dispatch(createProductThunk(formData)).unwrap();

      toast.success("Товар успішно створено");
      resetForm();
      setPreviewUrl(null);
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
        {({ isSubmitting, setFieldValue }) => (
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
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Превʼю товару"
                    className={css.previewImage}
                  />
                ) : (
                  <span className={css.uploadPlaceholder}>
                    <span className={css.uploadIcon}>+</span>
                    <span>Натисніть, щоб завантажити фото</span>
                  </span>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className={css.fileInput}
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0] || null;
                    setFieldValue("image", file);

                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                    } else {
                      setPreviewUrl(null);
                    }
                  }}
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
        )}
      </Formik>
    </div>
  );
};

export default ProductCreateForm;
