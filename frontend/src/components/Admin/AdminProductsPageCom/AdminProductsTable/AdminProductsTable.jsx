// src/components/Admin/AdminProductsTable/AdminProductsTable.jsx
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import css from "./AdminProductsTable.module.css";
import Loader from "../../../Loader/Loader";

const getMainImage = (product) => {
  if (product?.image) return product.image;
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images[0];
  }
  return null;
};

const getStockInfo = (product) => {
  const count =
    typeof product?.countInStock === "number"
      ? product.countInStock
      : typeof product?.stock === "number"
      ? product.stock
      : 0;

  if (count <= 0) {
    return { label: "Out of stock", variant: "out" };
  }
  if (count <= 5) {
    return { label: `${count} in stock`, variant: "low" };
  }
  return { label: `${count} in stock`, variant: "ok" };
};

const getStatusInfo = (product) => {
  const isActive =
    typeof product?.isActive === "boolean"
      ? product.isActive
      : product?.inStock ?? true;

  return isActive
    ? { label: "Active", variant: "active" }
    : { label: "Draft", variant: "draft" };
};

const AdminProductsTable = ({
  products = [],
  isLoading,
  error,
  page = 1,
  totalPages = 1,
  hasPrev,
  hasNext,
  totalCount,
  perPage = 12,
  searchTerm,
  categoryFilter,
  stockFilter,
  onSearchTermChange,
  onSearchSubmit,
  onCategoryChange,
  onStockChange,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit?.();
  };

  const handlePrev = () => {
    if (!hasPrev) return;
    onPageChange(page - 1);
  };

  const handleNext = () => {
    if (!hasNext) return;
    onPageChange(page + 1);
  };

  const pageSize = perPage || 12;
  const total = totalCount || products.length || 0;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(page * pageSize, total);

  return (
    <div className={css.card}>
      {/* HEADER + FILTERS */}
      <div className={css.header}>
        <h3 className={css.title}>All products</h3>

        <div className={css.filters}>
          <form className={css.searchForm} onSubmit={handleSearchSubmit}>
            <FiSearch className={css.searchIcon} />
            <input
              type="text"
              placeholder="Search products..."
              className={css.searchInput}
              value={searchTerm}
              onChange={(e) => onSearchTermChange?.(e.target.value)}
            />
          </form>

          <select
            className={css.select}
            value={categoryFilter}
            onChange={(e) => onCategoryChange?.(e.target.value)}
          >
            <option value="">All categories</option>
            <option value="necklace">Necklaces</option>
            <option value="bracelet">Bracelets</option>
            <option value="earrings">Earrings</option>
            <option value="other">Other</option>
          </select>

          <select
            className={css.select}
            value={stockFilter}
            onChange={(e) => onStockChange?.(e.target.value)}
          >
            <option value="">All status</option>
            <option value="inStock">In stock</option>
            <option value="outOfStock">Out of stock</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className={css.tableWrap}>
        <table className={css.table}>
          <thead>
            <tr>
              <th className={css.th}>Product</th>
              <th className={css.th}>Category</th>
              <th className={css.th}>Price</th>
              <th className={css.th}>Stock</th>
              <th className={css.th}>Status</th>
              <th className={css.thActions}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {error && !products.length && (
              <tr>
                <td className={css.tdEmpty} colSpan={7}>
                  {typeof error === "string"
                    ? error
                    : "Failed to load products"}
                </td>
              </tr>
            )}

            {!error && !products.length && !isLoading && (
              <tr>
                <td className={css.tdEmpty} colSpan={7}>
                  No products yet.
                </td>
              </tr>
            )}

            {products.map((product) => {
              const img = getMainImage(product);
              const stockInfo = getStockInfo(product);
              const statusInfo = getStatusInfo(product);

              return (
                <tr key={product._id} className={css.row}>
                  <td className={css.tdProduct}>
                    <div className={css.productCell}>
                      <div className={css.thumbWrap}>
                        {img ? (
                          <img
                            src={img}
                            alt={product.name || "product"}
                            className={css.thumb}
                            loading="lazy"
                          />
                        ) : (
                          <div className={css.thumbPlaceholder} />
                        )}
                      </div>
                      <div className={css.productText}>
                        <div className={css.productName}>
                          {product.name || "Unnamed product"}
                        </div>
                        {product.sku && (
                          <div className={css.productSku}>{product.sku}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className={css.td}>
                    <span className={css.categoryText}>
                      {product.category || "—"}
                    </span>
                  </td>

                  <td className={css.td}>
                    <span className={css.priceText}>
                      {product.price != null ? `$${product.price}` : "—"}
                    </span>
                  </td>

                  <td className={css.td}>
                    <span
                      className={`${css.badge} ${
                        stockInfo.variant === "ok"
                          ? css.badgeGreen
                          : stockInfo.variant === "low"
                          ? css.badgeYellow
                          : css.badgeRed
                      }`}
                    >
                      {stockInfo.label}
                    </span>
                  </td>

                  <td className={css.td}>
                    <span
                      className={`${css.badge} ${
                        statusInfo.variant === "active"
                          ? css.badgeGreenSoft
                          : css.badgeGray
                      }`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>

                  <td className={css.tdActions}>
                    <div className={css.actions}>
                      <button
                        type="button"
                        className={css.iconBtnMuted}
                        aria-label="View"
                      >
                        <FiEye />
                      </button>
                      <button
                        type="button"
                        className={css.iconBtnPrimary}
                        aria-label="Edit"
                        onClick={() => onEdit?.(product._id)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        className={css.iconBtnDanger}
                        aria-label="Delete"
                        onClick={() => onDelete?.(product._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {isLoading && (
              <tr>
                <td className={css.tdEmpty} colSpan={7}>
                  <Loader />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER / PAGINATION */}
      <div className={css.footer}>
        <div className={css.results}>
          {total === 0 ? (
            <>No results</>
          ) : (
            <>
              Showing <span>{from}</span>–<span>{to}</span> of{" "}
              <span>{total}</span> results
            </>
          )}
        </div>

        <div className={css.pager}>
          <button
            type="button"
            className={css.pageBtn}
            onClick={handlePrev}
            disabled={!hasPrev}
          >
            <FiChevronLeft />
          </button>

          <span className={css.pageCurrent}>
            {page} / {totalPages || 1}
          </span>

          <button
            type="button"
            className={css.pageBtn}
            onClick={handleNext}
            disabled={!hasNext}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsTable;
