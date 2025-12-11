import { Outlet } from "react-router-dom";
import { Suspense } from "react";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Loader from "../Loader/Loader";

import css from "./Layout.module.css";

const Layout = () => {
  return (
    <div className={css.page}>
      <span
        className={`${css.ornament} ${css.ornamentLeft}`}
        aria-hidden="true"
      />
      <span
        className={`${css.ornament} ${css.ornamentRight}`}
        aria-hidden="true"
      />
      <div className={css.container}>
        <Header />
        <main className={css.main}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
