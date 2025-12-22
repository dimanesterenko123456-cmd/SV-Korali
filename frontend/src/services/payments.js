import { API } from "../axiosConfig/api";

const normalizeItems = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const productId = item?._id || item?.id || item?.productId;
      const quantity = Number(item?.quantity ?? item?.qty ?? item?.count ?? 1);

      if (!productId || !Number.isFinite(quantity) || quantity <= 0)
        return null;

      return { productId, quantity };
    })
    .filter(Boolean);
};

export const createCheckoutSession = async (items = []) => {
  const payloadItems = normalizeItems(items);

  const response = await API.post("/payments/checkout", {
    items: payloadItems,
  });

  return response.data?.data;
};
