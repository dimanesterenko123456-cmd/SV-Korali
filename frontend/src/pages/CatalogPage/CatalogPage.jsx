import { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
  selectProductsMaxPrice,
  selectProductsPage,
  selectProductsTotalPages,
} from "../../redux/selectors/productSelectors";

import {
  fetchMaxProductPriceThunk,
  fetchProductsThunk,
} from "../../redux/operations/productOperations";

import CatalogHero from "../../components/Catalog/CatalogHero/CatalogHero";
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

  const maxPriceFromStore = useSelector(selectProductsMaxPrice);
  const maxLimit =
    maxPriceFromStore > 0 ? Math.ceil(maxPriceFromStore / 5) * 5 : 300;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");

  // ✅ priceMax: null => "до максимуму"
  const [filtersDraft, setFiltersDraft] = useState({
    category: "",
    priceMin: 0,
    priceMax: null, // ✅
    inStockOnly: false,
  });

  const [filters, setFilters] = useState(filtersDraft);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const mobileFiltersRef = useRef(null);

  const suggestions = useMemo(() => {
    return (products || []).map((p) => p?.name).filter(Boolean);
  }, [products]);

  useEffect(() => {
    dispatch(fetchMaxProductPriceThunk());
  }, [dispatch]);

  const buildParams = useCallback(
    ({ page: p, sortOverride, filtersOverride, searchOverride }) => {
      const params = { page: p, perPage: 9 };

      const q = (searchOverride ?? search).trim();
      if (q) params.search = q;

      const f = filtersOverride || filters;

      if (f.category) params.category = f.category;
      if (f.inStockOnly) params.inStock = true;

      // ✅ minPrice шлемо лише якщо > 0
      if (Number.isFinite(f.priceMin) && f.priceMin > 0) {
        params.minPrice = f.priceMin;
      }

      // ✅ maxPrice шлемо лише якщо є реальне обмеження (не null і менше maxLimit)
      if (
        f.priceMax !== null &&
        Number.isFinite(f.priceMax) &&
        f.priceMax < maxLimit
      ) {
        params.maxPrice = f.priceMax;
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
    [filters, sort, search, maxLimit]
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

  const handleSearchSubmit = (valueFromSearchBox) => {
    const q =
      typeof valueFromSearchBox === "string" ? valueFromSearchBox : search;
    setSearch(q);
    fetchWithParams(1, { search: q });
  };

  const handleSearchSelect = (value) => {
    setSearch(value);
    fetchWithParams(1, { search: value });
  };

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
    setMobileFiltersOpen(false);
  };

  const handleClearFilters = () => {
    const cleared = {
      category: "",
      priceMin: 0,
      priceMax: null, // ✅
      inStockOnly: false,
    };

    setFiltersDraft(cleared);
    setFilters(cleared);
    setSearch("");
    setSort("popular");
    fetchWithParams(1, { filters: cleared, search: "", sort: "popular" });
    setMobileFiltersOpen(false);
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen((prev) => !prev);

    requestAnimationFrame(() => {
      mobileFiltersRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const pagination = { page, totalPages, hasPrev, hasNext };

  return (
    <section className={css.page}>
      <CatalogHero />

      <div className={css.main}>
        <div className={css.container}>
          <div className={css.layout}>
            {/* DESKTOP SIDEBAR */}
            <aside className={css.sidebar}>
              <CatalogFilters
                namePrefix="desktop"
                maxPriceLimit={maxLimit}
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
                searchValue={search}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
                onSearchSelect={handleSearchSelect}
                suggestions={suggestions}
              />

              {/* MOBILE FILTERS TOGGLE */}
              <div className={css.mobileFiltersBar}>
                <button
                  type="button"
                  className={css.filtersToggleBtn}
                  onClick={toggleMobileFilters}
                  aria-expanded={mobileFiltersOpen}
                  aria-controls="mobileFiltersPanel"
                >
                  Filters
                  <span
                    className={`${css.chev} ${
                      mobileFiltersOpen ? css.chevUp : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                <p className={css.filtersHint}>
                  Tap to adjust category, price & availability
                </p>
              </div>

              <div
                id="mobileFiltersPanel"
                ref={mobileFiltersRef}
                className={`${css.mobileFiltersPanel} ${
                  mobileFiltersOpen ? css.mobileFiltersPanelOpen : ""
                }`}
              >
                <CatalogFilters
                  namePrefix="mobile"
                  maxPriceLimit={maxLimit}
                  filtersDraft={filtersDraft}
                  onDraftChange={handleFiltersDraftChange}
                  onApply={handleApplyFilters}
                  onClear={handleClearFilters}
                  variant="mobile"
                />
              </div>

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
                  view="grid"
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
