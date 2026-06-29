import { useQuery } from "@tanstack/react-query";
import client from "../../api/client";

export function useProducts({ search = "", categoryId = "", page = 1 } = {}) {
  return useQuery({
    queryKey: ["products", { search, categoryId, page }],
    queryFn: async () => {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;
      const res = await client.get("/api/products", { params });
      const data = res.data?.data;
      const products = data?.all ?? [];
      const totalPages = data?.pagination?.pages ?? 1;
      return { products, totalPages };
    },
  });
}

export function useProductDetail(id) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () =>
      client.get(`/api/products/${id}`).then((r) => r.data.data.product),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      client.get("/api/categories").then((r) => r.data?.data ?? []),
  });
}
