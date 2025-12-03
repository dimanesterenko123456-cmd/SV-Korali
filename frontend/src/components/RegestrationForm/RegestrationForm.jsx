// src/components/RegistrationForm/RegistrationForm.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import css from "./RegestrationForm.module.css";
import { registerUserThunk } from "../../redux/operations/authOperations";

const validationSchema = Yup.object({
  name: Yup.string().required("Імʼя обовʼязкове"),
  email: Yup.string().email("Некоректний email").required("Email обовʼязковий"),
  password: Yup.string()
    .min(6, "Мінімум 6 символів")
    .required("Пароль обовʼязковий"),
});

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("📨 handleSubmit register CALLED with:", values);
    try {
      await dispatch(
        registerUserThunk({
          name: values.name,
          email: values.email,
          password: values.password,
        })
      ).unwrap();

      toast.success("Реєстрація успішна! Тепер увійдіть.");
      navigate("/auth/login");
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error || "Помилка реєстрації");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={css.formContainer}>
      <h2 className={css.title}>Реєстрація</h2>
      <p className={css.subtitle}>Створіть акаунт для покупок</p>

      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <div className={css.fieldGroup}>
              <label htmlFor="name" className={css.label}>
                Ім&apos;я
              </label>
              <Field
                id="name"
                name="name"
                placeholder="Ваше імʼя"
                className={css.input}
              />
              <ErrorMessage name="name" component="div" className={css.error} />
            </div>

            <div className={css.fieldGroup}>
              <label htmlFor="email" className={css.label}>
                Email
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className={css.input}
              />
              <ErrorMessage
                name="email"
                component="div"
                className={css.error}
              />
            </div>

            <div className={css.fieldGroup}>
              <label htmlFor="password" className={css.label}>
                Пароль
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Пароль"
                className={css.input}
              />
              <ErrorMessage
                name="password"
                component="div"
                className={css.error}
              />
            </div>

            <button
              type="submit"
              className={css.button}
              // 👇 лишаємо тільки isSubmitting,
              // щоб сабміт завжди спрацьовував
              disabled={isSubmitting}
            >
              {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
            </button>
          </Form>
        )}
      </Formik>

      <div className={css.registerwrapp}>
        <p className={css.registerwrapp_text}>Вже маєте акаунт?</p>
        <Link to="/auth/login" className={css.registerwrapp_link}>
          Увійти
        </Link>
      </div>
    </div>
  );
};

export default RegistrationForm;
