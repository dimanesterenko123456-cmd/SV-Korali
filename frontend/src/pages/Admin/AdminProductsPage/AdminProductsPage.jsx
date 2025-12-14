// src/pages/Admin/AdminProductsPage/AdminProductsPage.jsx
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import css from "./AdminProductsPage.module.css";

import { useNavigate } from "react-router-dom";
import {
  selectProducts,
  selectProductsCount,
  selectProductsError,
  selectProductsLoading,
  selectProductsTotalPages,
} from "../../../redux/selectors/productSelectors";
import {
  deleteProductThunk,
  fetchProductsThunk,
} from "../../../redux/operations/productOperations";
import AdminProductsHeader from "../../../components/Admin/AdminProductsPageCom/AdminProductsHeader/AdminProductsHeader";
import AdminProductsStats from "../../../components/Admin/AdminProductsPageCom/AdminProductsStats/AdminProductsStats";
import Loader from "../../../components/Loader/Loader";
import AdminProductsTable from "../../../components/Admin/AdminProductsPageCom/AdminProductsTable/AdminProductsTable";

const PER_PAGE = 12;

const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector(selectProducts);
  const totalCount = useSelector(selectProductsCount);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const totalPagesFromStore = useSelector(selectProductsTotalPages);

  // локальний стан фільтрів та пагінації
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  // формуємо параметри запиту для бекенда
  const buildParams = useCallback(() => {
    const params = {
      page,
      perPage: PER_PAGE,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (categoryFilter) params.category = categoryFilter;
    if (stockFilter === "inStock") params.inStock = true;
    if (stockFilter === "outOfStock") params.inStock = false;

    return params;
  }, [page, searchTerm, categoryFilter, stockFilter]);

  // єдиний useEffect, який дійсно тягне продукти
  useEffect(() => {
    dispatch(fetchProductsThunk(buildParams()));
  }, [dispatch, buildParams]);

  // коли міняємо фільтри – скидаємо на першу сторінку
  const handleSearchSubmit = () => {
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setPage(1);
  };

  const handleStockChange = (value) => {
    setStockFilter(value);
    setPage(1);
  };

  // пагінація: ТІЛЬКИ змінюємо сторінку
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleAddProduct = () => {
    navigate("/admin/products/new");
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/${id}`);
  };

  const handleDelete = (id) => {
    dispatch(deleteProductThunk(id));
  };

  const totalPages =
    totalPagesFromStore || Math.max(1, Math.ceil((totalCount || 0) / PER_PAGE));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <section className={css.page}>
      <div className={css.inner}>
        <AdminProductsHeader onAddProduct={handleAddProduct} />

        <AdminProductsStats products={products} totalCount={totalCount} />

        <div className={css.tableBlock}>
          {isLoading && !products.length ? (
            <div className={css.loaderWrap}>
              <Loader />
            </div>
          ) : (
            <AdminProductsTable
              products={products}
              isLoading={isLoading}
              error={error}
              page={page}
              totalPages={totalPages}
              hasPrev={hasPrev}
              hasNext={hasNext}
              totalCount={totalCount}
              perPage={PER_PAGE}
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              stockFilter={stockFilter}
              onSearchTermChange={setSearchTerm}
              onSearchSubmit={handleSearchSubmit}
              onCategoryChange={handleCategoryChange}
              onStockChange={handleStockChange}
              onPageChange={handlePageChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminProductsPage;
