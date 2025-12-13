import CatalogProducts from "../../CatalogProducts/CatalogProducts";
import css from "./CatalogSection.module.css";

const CatalogSection = ({ products, pagination, onPageChange, view }) => {
  const variant = view === "list" ? "list" : "welcome";

  return (
    <div className={css.section}>
      <CatalogProducts
        products={products}
        pagination={pagination}
        onPageChange={onPageChange}
        variant={variant}
      />
    </div>
  );
};

export default CatalogSection;
