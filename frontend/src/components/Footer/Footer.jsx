import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import css from "./Footer.module.css";

const Footer = () => {
  // const handleSubscribe = (e) => {
  //   e.preventDefault();
  // };

  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.top}>
          {/* BRAND */}
          <div className={css.brand}>
            <div className={css.brandRow}>
              <span className={css.brandName}>SV.Korali</span>
            </div>

            <p className={css.brandText}>
              Authentic Ukrainian coral jewelry, handcrafted with traditional
              techniques, passed down through generations.
            </p>
          </div>

          {/* COLUMNS */}
          <div className={css.columns}>
            <div className={css.col}>
              <p className={css.heading}>Shop</p>
              <ul className={css.list}>
                <li>
                  <Link className={css.link} to="/catalog">
                    Collections
                  </Link>
                </li>
              </ul>
            </div>

            <div className={css.col}>
              <p className={css.heading}>Contacts</p>
              <ul className={css.list}>
                <li>
                  <a className={css.link} href="tel:+15063774161">
                    +1 506 377 41 61
                  </a>
                </li>
                <li>
                  <a className={css.link} href="mailto:sv.korali@gmail.com">
                    sv.korali@gmail.com
                  </a>
                </li>
                <li className={css.contactText}>Mon-Fri 9 AM - 6 PM EST</li>
              </ul>
            </div>

            {/* NEWSLETTER */}
            {/* <div className={css.col}>
              <p className={css.heading}>Newsletter</p>
              <p className={css.note}>
                Subscribe to get special offers and updates
              </p>

              <form className={css.form} onSubmit={handleSubscribe}>
                <input
                  className={css.input}
                  type="email"
                  placeholder="Your email"
                  aria-label="Your email"
                  required
                />
                <button
                  className={css.submit}
                  type="submit"
                  aria-label="Submit"
                >
                  <FiArrowRight />
                </button>
              </form>
            </div> */}
          </div>
        </div>

        <div className={css.bottom}>
          <span className={css.copy}>© 2024 Korali. All rights reserved.</span>

          <div className={css.social}>
            <a
              className={css.iconBtn}
              href="https://www.facebook.com/share/1DGWGvw2hV/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              className={css.iconBtn}
              href="https://www.instagram.com/sv.korali/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
