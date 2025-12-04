// src/components/LoginForm/LoginForm.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import css from "./LoginForm.module.css";
import {
  fetchCurrentUserThunk,
  loginUserThunk,
} from "../../redux/operations/authOperations";

const validationSchema = Yup.object({
  email: Yup.string().email("Некоректний email").required("Email обовʼязковий"),
  password: Yup.string().required("Пароль обовʼязковий"),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(loginUserThunk(values)).unwrap();
      await dispatch(fetchCurrentUserThunk()).unwrap();
      toast.success("Успішний вхід!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Невірний email або пароль");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={css.formContainer}>
      <h2 className={css.title}>Вхід</h2>
      <p className={css.subtitle}>
        Ласкаво просимо! Введіть ваші дані для входу.
      </p>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Вхід..." : "Увійти"}
            </button>
          </Form>
        )}
      </Formik>

      <div className={css.registerwrapp}>
        <p className={css.registerwrapp_text}>Ще не маєте акаунта?</p>
        <Link to="/auth/register" className={css.registerwrapp_link}>
          Зареєструватися
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
