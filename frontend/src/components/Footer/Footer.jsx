import css from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={css.footer}>
      <div className={css.footerTop}>
        <div className={css.footerBrand}>
          <h3 className={css.footerLogo}>Korali</h3>
          <p className={css.footerText}>
            Authentic Ukrainian coral jewelry handcrafted with traditional
            techniques. Preserving heritage since 1998.
          </p>
        </div>

        <div className={css.footerColumns}>
          <div>
            <p className={css.footerHeading}>Collections</p>
            <ul>
              <li>Traditional</li>
              <li>Heritage</li>
              <li>Modern</li>
            </ul>
          </div>
          <div>
            <p className={css.footerHeading}>Support</p>
            <ul>
              <li>Shipping &amp; returns</li>
              <li>Care instructions</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <p className={css.footerHeading}>Contact</p>
            <ul>
              <li>info@korali.com</li>
              <li>+1 (888) 750-6838</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={css.footerBottom}>
        <span>© 2024 Korali. All rights reserved.</span>
        <div className={css.footerLegal}>
          <span>Privacy policy</span>
          <span>Terms of service</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
