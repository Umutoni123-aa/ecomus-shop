import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../api/client";

export function useCart(userId) {
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: () =>
      client
        .get("/api/cart", { params: { userId } })
        .then((r) => r.data.data.cart),
    enabled: !!userId,
  });
}

// If a product has no variants the API still requires a variantId.
// We auto-create a "Default" variant on the fly and cache its id so
// we never create duplicates on repeated add-to-cart clicks.
const defaultVariantCache = {};

async function resolveVariantId(productId, variantId, product) {
  if (variantId) return variantId;

  if (defaultVariantCache[productId]) return defaultVariantCache[productId];

  // Re-fetch product to get any already-existing variant
  const detail = await client
    .get(`/api/products/${productId}`)
    .then((r) => r.data.data.product);

  if (detail.variants?.length > 0) {
    defaultVariantCache[productId] = detail.variants[0].id;
    return detail.variants[0].id;
  }

  // No variant exists — create one
  const price = product?.price ?? detail.price ?? 0;
  const stock = product?.stock ?? detail.stock ?? 1;
  const sku = `DEF-${productId.slice(-6).toUpperCase()}`;
  const created = await client
    .post(`/api/products/${productId}/variants`, {
      color: "Default",
      price,
      stock,
      sku,
    })
    .then((r) => r.data.data.variant);

  defaultVariantCache[productId] = created.id;
  return created.id;
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, productId, variantId, quantity, product }) => {
      const resolvedVariantId = await resolveVariantId(productId, variantId, product);
      return client
        .post("/api/cart/items", { userId, productId, variantId: resolvedVariantId, quantity })
        .then((r) => r.data.data.cart);
    },
    onSuccess: (cart, { userId }) => {
      qc.setQueryData(["cart", userId], cart);
    },
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, itemId, quantity }) =>
      client
        .patch(`/api/cart/items/${itemId}`, { userId, quantity })
        .then((r) => r.data.data.cart),
    onSuccess: (cart, { userId }) => {
      qc.setQueryData(["cart", userId], cart);
    },
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, itemId }) =>
      client
        .delete(`/api/cart/items/${itemId}`, { data: { userId } })
        .then((r) => r.data.data.cart),
    onSuccess: (cart, { userId }) => {
      qc.setQueryData(["cart", userId], cart);
    },
  });
}
