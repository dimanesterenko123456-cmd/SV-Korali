import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import css from "./RegestrationForm.module.css";
import { registerUserThunk } from "../../redux/operations/authOperations";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "min 6 symbols")
    .required("Password is required"),
});

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const registration = await dispatch(
        registerUserThunk({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      ).unwrap();

      if (registration?.coupon) {
        setCoupon(registration.coupon);
        toast.success("Registration successful! Your welcome coupon is ready.");
      } else {
        toast.success("Registration successful! Now log in.");
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error(error || "Registration error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
    } catch {
      toast.info(`Your coupon code is ${coupon.code}`);
    }
  };

  const handleCouponClose = () => {
    setCoupon(null);
    navigate("/auth/login");
  };

  return (
    <>
      <div className={css.formContainer}>
        <h2 className={css.title}>Registration</h2>
        <p className={css.subtitle}>Create an account for shopping</p>

        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className={css.form}>
              <div className={css.fieldGroup}>
                <label htmlFor="name" className={css.label}>
                  Name
                </label>
                <Field
                  id="name"
                  name="name"
                  placeholder="Your name"
                  className={css.input}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={css.error}
                />
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
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={css.input}
                  autoComplete="new-password"
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
                {isSubmitting ? "Registration..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        <div className={css.registerwrapp}>
          <p className={css.registerwrapp_text}>Already have an account?</p>
          <Link to="/auth/login" className={css.registerwrapp_link}>
            Sign in
          </Link>
        </div>
      </div>

      {coupon && (
        <div className={css.couponOverlay}>
          <div
            className={css.couponModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-coupon-title"
          >
            <div className={css.couponBadge}>WELCOME GIFT</div>
            <p className={css.couponEyebrow}>Thank you for joining SV.Korali</p>
            <h2 id="welcome-coupon-title" className={css.couponValue}>
              $10 OFF
            </h2>
            <p className={css.couponOnly}>In-store purchase only</p>

            <div className={css.couponCodeBlock}>
              <span>Your unique code</span>
              <strong>{coupon.code}</strong>
              <button type="button" onClick={handleCopyCoupon}>
                {copied ? "Copied!" : "Copy code"}
              </button>
            </div>

            <div className={css.storeDetails}>
              <strong>SV.Korali</strong>
              <span>26-30 Six Point Rd, Toronto (Etobicoke)</span>
              <span>Show this code or a screenshot before checkout.</span>
            </div>

            <button
              type="button"
              className={css.continueButton}
              onClick={handleCouponClose}
            >
              Continue to sign in
            </button>

            <p className={css.finePrint}>
              One-time use. One coupon per family per day. Valid in store only.
              Cannot be combined with other offers or redeemed for cash.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default RegistrationForm;
