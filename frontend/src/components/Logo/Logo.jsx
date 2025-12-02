import { Link } from "react-router-dom";
import css from "./Logo.module.css";

const Logo = () => {
  return (
    <div className={css.wrapper}>
      <Link to="/" className={css.link}>
        SV.KORALI
      </Link>
    </div>
  );
};

export default Logo;
