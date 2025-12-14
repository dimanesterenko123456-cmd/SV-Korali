import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import css from "./CatalogPage.module.css";

import Loader from "../../components/Loader/Loader";
import {
  selectProducts,
  selectProductsCount,
  selectProductsError,
  selectProductsHasNext,
  selectProductsHasPrev,
  selectProductsLoading,
  selectProductsPage,
  selectProductsTotalPages,
} from "../../redux/selectors/productSelectors";
import { fetchProductsThunk } from "../../redux/operations/productOperations";
import CatalogHero from "../../components/Catalog/CatalogHero/CaralogHero";
import CatalogFilters from "../../components/Catalog/CatalogFilters/CatalogFilters";
import CatalogToolbar from "../../components/Catalog/CatalogToolbar/CatalogToolbar";
import CatalogSection from "../../components/Catalog/CatalogSection/CatalogSection";

const CatalogPage = () => {
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const totalCount = useSelector(selectProductsCount);
  const page = useSelector(selectProductsPage);
  const totalPages = useSelector(selectProductsTotalPages);
  const hasNext = useSelector(selectProductsHasNext);
  const hasPrev = useSelector(selectProductsHasPrev);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState("grid"); // ✅ grid/list як в макеті

  const [filtersDraft, setFiltersDraft] = useState({
    category: "",
    priceRange: "any",
    inStockOnly: false,
  });

  const [filters, setFilters] = useState(filtersDraft);

  const buildParams = useCallback(
    ({ page: p, sortOverride, filtersOverride, searchOverride }) => {
      const params = { page: p, perPage: 12 };

      const q = searchOverride ?? search;
      if (q.trim()) params.search = q.trim();

      const f = filtersOverride || filters;

      if (f.category) params.category = f.category;
      if (f.inStockOnly) params.inStock = true;

      switch (f.priceRange) {
        case "under_50":
          params.maxPrice = 50;
          break;
        case "50_150":
          params.minPrice = 50;
          params.maxPrice = 150;
          break;
        case "over_150":
          params.minPrice = 150;
          break;
        default:
          break;
      }

      const s = sortOverride || sort;
      switch (s) {
        case "price_asc":
          params.sortBy = "price";
          params.sortOrder = "asc";
          break;
        case "price_desc":
          params.sortBy = "price";
          params.sortOrder = "desc";
          break;
        case "newest":
          params.sortBy = "createdAt";
          params.sortOrder = "desc";
          break;
        default:
          break;
      }

      return params;
    },
    [filters, sort, search]
  );

  const fetchWithParams = useCallback(
    (pageToLoad = 1, options = {}) => {
      const params = buildParams({
        page: pageToLoad,
        sortOverride: options.sort,
        filtersOverride: options.filters,
        searchOverride: options.search,
      });

      dispatch(fetchProductsThunk(params));
    },
    [buildParams, dispatch]
  );

  useEffect(() => {
    fetchWithParams(1);
  }, [fetchWithParams]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    fetchWithParams(nextPage);
  };

  const handleSearchChange = (event) => setSearch(event.target.value);
  const handleSearchSubmit = () => fetchWithParams(1);

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSort(value);
    fetchWithParams(1, { sort: value });
  };

  const handleFiltersDraftChange = (key, value) => {
    setFiltersDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(filtersDraft);
    fetchWithParams(1, { filters: filtersDraft });
  };

  const handleClearFilters = () => {
    const cleared = { category: "", priceRange: "any", inStockOnly: false };
    setFiltersDraft(cleared);
    setFilters(cleared);
    setSearch("");
    setSort("popular");
    setView("grid");
    fetchWithParams(1, { filters: cleared, search: "", sort: "popular" });
  };

  const pagination = { page, totalPages, hasPrev, hasNext };

  return (
    <section className={css.page}>
      <CatalogHero />

      <div className={css.main}>
        <div className={css.container}>
          <div className={css.layout}>
            <aside className={css.sidebar}>
              <CatalogFilters
                filtersDraft={filtersDraft}
                onDraftChange={handleFiltersDraftChange}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />
            </aside>

            <div className={css.content}>
              <CatalogToolbar
                totalCount={totalCount}
                sort={sort}
                onSortChange={handleSortChange}
                view={view}
                onViewChange={setView}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
              />

              {isLoading && (
                <div className={css.loader}>
                  <Loader />
                </div>
              )}

              {!isLoading && error && (
                <div className={css.error}>
                  {typeof error === "string"
                    ? error
                    : "Failed to load products"}
                </div>
              )}

              {!isLoading && !error && (
                <CatalogSection
                  products={products}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  view={view}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogPage;
