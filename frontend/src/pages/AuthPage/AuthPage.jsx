import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import css from "./AuthPage.module.css";
import RegestrationForm from "../../components/RegestrationForm/RegestrationForm";
import LoginForm from "../../components/LoginForm/LoginForm";
import DebugRedux from "../../components/DebugRedux/DebugRedux";

const AuthPage = () => {
  const { authType } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (authType !== "login" && authType !== "register") {
      navigate("/auth/login", { replace: true });
    }
  }, [authType, navigate]);

  return (
    <div className={css.container}>
      {authType === "register" ? <RegestrationForm /> : <LoginForm />}
      <DebugRedux />
    </div>
  );
};

export default AuthPage;
