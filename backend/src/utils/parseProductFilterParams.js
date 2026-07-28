// src/utils/parseProductFilterParams.js

const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) return undefined;
  return parsed;
};

const parseBoolean = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') return value;

  const normalized = String(value).toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;

  return undefined;
};

export const parseProductFilterParams = (query) => {
  const { category, materials, minPrice, maxPrice, inStock, search } = query;

  const filter = {};

  // category: ?category=ring або ?category=ring,bracelet
  if (category) {
    const categories = String(category)
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (categories.length === 1) {
      filter.category = categories[0];
    } else if (categories.length > 1) {
      filter.category = { $in: categories };
    }
  }

  // materials: ?materials=coral або ?materials=coral,glass
  if (materials) {
    const materialValues = String(materials)
      .split(',')
      .map((material) => material.trim())
      .filter(Boolean);

    if (materialValues.length === 1) {
      filter.materials = materialValues[0];
    } else if (materialValues.length > 1) {
      filter.materials = { $in: materialValues };
    }
  }

  // price: ?minPrice=100&maxPrice=500
  const min = parseNumber(minPrice);
  const max = parseNumber(maxPrice);

  if (min !== undefined || max !== undefined) {
    filter.price = {};
    if (min !== undefined) {
      filter.price.$gte = min;
    }
    if (max !== undefined) {
      filter.price.$lte = max;
    }
  }

  // inStock: ?inStock=true / false
  const inStockParsed = parseBoolean(inStock);
  if (inStockParsed !== undefined) {
    filter.inStock = inStockParsed;
  }

  // search по name/description: ?search=korali
  if (search) {
    const regex = new RegExp(String(search).trim(), 'i');
    filter.$or = [{ name: regex }, { description: regex }];
  }

  return filter;
};
