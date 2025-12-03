import React from "react";
import { DotLoader } from "react-spinners";
import s from "./Loader.module.css";
const Loader = () => {
  return (
    <div className={s.loading}>
      <DotLoader />
    </div>
  );
};

export default Loader;
