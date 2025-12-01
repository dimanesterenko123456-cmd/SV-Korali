// src/utils/parseSortParams.js

import { SORT_ORDER } from '../constans/index.js';

export const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
};

const PRODUCT_SORT_FIELDS = [
  'name',
  'price',
  'category',
  'inStock',
  'countInStock',
  'createdAt',
  'updatedAt',
];

const parseSortBy = (sortBy) => {
  if (!sortBy) {
    return 'createdAt';
  }

  if (PRODUCT_SORT_FIELDS.includes(sortBy)) {
    return sortBy;
  }

  return 'createdAt';
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
