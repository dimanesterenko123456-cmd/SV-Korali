// src/controllers/product.js
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} from '../services/product.js';

import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseProductFilterParams } from '../utils/parseProductFilterParams.js';
import { parseSortParams } from '../utils/ParseSortPArams.js';

const parseListField = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return undefined;
};

const collectImagesFromRequest = async (req) => {
  let images = [];

  if (Array.isArray(req.body.images)) {
    images = req.body.images.filter(Boolean);
  } else if (req.body.images) {
    images = [req.body.images];
  } else if (req.body.image) {
    images = [req.body.image];
  }

  const useCloudinary = getEnvVar('ENABLE_CLOUDINARY') === 'true';

  const upload = async (file) =>
    useCloudinary
      ? await saveFileToCloudinary(file)
      : await saveFileToUploadDir(file);

  if (req.files && !Array.isArray(req.files)) {
    const groupedFiles = Object.values(req.files).reduce((acc, value) => {
      if (Array.isArray(value)) {
        acc.push(...value);
      }
      return acc;
    }, []);

    if (groupedFiles.length > 0) {
      const uploaded = await Promise.all(groupedFiles.map(upload));
      images = [...images, ...uploaded];
    }
  } else if (Array.isArray(req.files) && req.files.length > 0) {
    const uploaded = await Promise.all(req.files.map(upload));
    images = [...images, ...uploaded];
  } else if (req.file) {
    const url = await upload(req.file);
    images.push(url);
  }

  return images;
};

export const getAllProductsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseProductFilterParams(req.query);

    const result = await getAllProducts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });

    res.json({
      status: 200,
      message: 'Successfully found products!',
      ...result, // data, count, page, perPage, totalPages, hasNextPage, hasPrevPage
    });
  } catch (err) {
    next(err);
  }
};

export const getProductByIdController = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw createHttpError(400, 'Invalid product id');
  }

  const product = await getProductById(productId);

  if (!product) {
    throw createHttpError(404, 'Product not found');
  }

  res.json({
    status: 200,
    message: `Successfully found product with id ${productId}!`,
    data: product,
  });
};

export const createProductController = async (req, res, next) => {
  try {
    const images = await collectImagesFromRequest(req);

    const payload = {
      ...req.body,
    };

    if (payload.price !== undefined) {
      payload.price = Number(payload.price);
    }

    // if (payload.length !== undefined) {
    //   payload.length = parseSizeField(payload.length) ?? [];
    // }

    // if (payload.beadSize !== undefined) {
    //   payload.beadSize = parseSizeField(payload.beadSize) ?? [];
    // }

    if (payload.materials !== undefined) {
      payload.materials = parseListField(payload.materials) ?? [];
    }

    if (payload.countInStock !== undefined) {
      payload.countInStock = Number(payload.countInStock);
    }

    if (payload.inStock !== undefined) {
      if (typeof payload.inStock === 'string') {
        payload.inStock = payload.inStock === 'true';
      }
    }

    if (
      payload.availableToOrder !== undefined &&
      typeof payload.availableToOrder === 'string'
    ) {
      payload.availableToOrder = payload.availableToOrder === 'true';
    }

    if (images.length) {
      payload.images = images;
      payload.image = images[0];
    }

    const product = await createProduct(payload);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a product!',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProductController = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw createHttpError(400, 'Invalid product id');
  }

  const product = await deleteProductById(productId);

  if (!product) {
    throw createHttpError(404, 'Product not found');
  }

  res.status(204).send();
};

export const patchProductController = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw createHttpError(400, 'Invalid product id');
    }

    const images = await collectImagesFromRequest(req);

    const payload = {
      ...req.body,
    };

    if (payload.price !== undefined) {
      payload.price = Number(payload.price);
    }

    // if (payload.length !== undefined) {
    //   payload.length = parseSizeField(payload.length) ?? [];
    // }

    // if (payload.beadSize !== undefined) {
    //   payload.beadSize = parseSizeField(payload.beadSize) ?? [];
    // }

    if (payload.materials !== undefined) {
      payload.materials = parseListField(payload.materials) ?? [];
    }

    if (payload.countInStock !== undefined) {
      payload.countInStock = Number(payload.countInStock);
    }

    if (payload.inStock !== undefined) {
      if (typeof payload.inStock === 'string') {
        payload.inStock = payload.inStock === 'true';
      }
    }

    if (
      payload.availableToOrder !== undefined &&
      typeof payload.availableToOrder === 'string'
    ) {
      payload.availableToOrder = payload.availableToOrder === 'true';
    }

    if (images.length) {
      payload.images = images;
      payload.image = images[0];
    }

    if (Object.keys(payload).length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: 'No fields to update' });
    }

    const updatedProduct = await updateProductById(productId, payload);

    if (!updatedProduct) {
      throw createHttpError(404, 'Product not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully patched product with id ${productId}!`,
      data: updatedProduct,
    });
  } catch (err) {
    next(err);
  }
};
