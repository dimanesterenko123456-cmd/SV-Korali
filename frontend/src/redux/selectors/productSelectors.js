// src/redux/selectors/productsSelectors.js

export const selectProducts = (state) => state.products.items;
export const selectProductsCount = (state) => state.products.count;
export const selectProductsPage = (state) => state.products.page;
export const selectProductsPerPage = (state) => state.products.perPage;
export const selectProductsTotalPages = (state) => state.products.totalPages;
export const selectProductsHasNext = (state) => state.products.hasNextPage;
export const selectProductsHasPrev = (state) => state.products.hasPrevPage;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading = (state) => state.products.isLoading;
export const selectProductsError = (state) => state.products.error;
