// src/pages/AuthPage/AuthPage.jsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import css from "./AuthPage.module.css";
import RegestrationForm from "../../components/RegestrationForm/RegestrationForm";
import LoginForm from "../../components/LoginForm/LoginForm";

const AuthPage = () => {
  const { authType } = useParams();
  const navigate = useNavigate();

  const current = authType === "register" ? "register" : "login";

  useEffect(() => {
    if (authType !== "login" && authType !== "register") {
      navigate("/auth/login", { replace: true });
    }
  }, [authType, navigate]);

  const handleTabClick = (type) => {
    if (type !== current) {
      navigate(`/auth/${type}`);
    }
  };

  return (
    <section className={css.page}>
      <div className={css.card}>
        {/* Tabs */}
        <div className={css.tabs}>
          <button
            type="button"
            className={`${css.tab} ${current === "login" ? css.tabActive : ""}`}
            onClick={() => handleTabClick("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`${css.tab} ${
              current === "register" ? css.tabActive : ""
            }`}
            onClick={() => handleTabClick("register")}
          >
            Registration
          </button>
        </div>

        {/* Form */}
        <div className={css.body}>
          {current === "register" ? <RegestrationForm /> : <LoginForm />}
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
