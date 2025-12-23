import { useMemo, useState } from "react";
import css from "./ProductTabs.module.css";

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description");

  const descriptionText = useMemo(() => {
    const raw = product?.description;
    if (!raw) {
      return [
        "This piece is handcrafted using traditional techniques and carefully selected materials.",
        "Natural variations in coral make each item unique.",
      ];
    }

    const text = String(raw).trim();
    const parts = text
      .split(/\n{2,}/g)
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length) return parts;

    return [text];
  }, [product]);

  const shippingText = useMemo(() => {
    return [
      "We ship worldwide. Orders are usually dispatched within 3–5 business days.",
      "Returns are accepted within 14 days in original condition. Customized pieces may be non-refundable.",
    ];
  }, []);

  const careText = useMemo(() => {
    return [
      "Store in a dry place, away from direct sunlight.",
      "Avoid contact with perfumes and aggressive chemicals.",
      "Wipe gently with a soft cloth after wearing.",
    ];
  }, []);

  return (
    <section className={css.tabsSection}>
      <div className={css.tabBar} role="tablist" aria-label="Product details">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "description"}
          className={`${css.tabBtn} ${
            activeTab === "description" ? css.tabBtnActive : ""
          }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "shipping"}
          className={`${css.tabBtn} ${
            activeTab === "shipping" ? css.tabBtnActive : ""
          }`}
          onClick={() => setActiveTab("shipping")}
        >
          Shipping Info
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "care"}
          className={`${css.tabBtn} ${
            activeTab === "care" ? css.tabBtnActive : ""
          }`}
          onClick={() => setActiveTab("care")}
        >
          Care Instructions
        </button>
      </div>

      <div className={css.panel}>
        {activeTab === "description" ? (
          <div className={css.block}>
            <h3 className={css.heading}>About This Piece</h3>
            <div className={css.prose}>
              {descriptionText.map((p, i) => (
                <p key={i} className={css.p}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "shipping" ? (
          <div className={css.block}>
            <h3 className={css.heading}>Shipping & Returns</h3>
            <div className={css.prose}>
              {shippingText.map((p, i) => (
                <p key={i} className={css.p}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "care" ? (
          <div className={css.block}>
            <h3 className={css.heading}>Care Instructions</h3>
            <ul className={css.list}>
              {careText.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProductTabs;
