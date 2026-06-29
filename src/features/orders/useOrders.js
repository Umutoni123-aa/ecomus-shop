import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../api/client";

export function useOrders(userId) {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: () =>
      client
        .get("/api/orders", { params: { userId } })
        .then((r) => r.data.data),
    enabled: !!userId,
  });
}

export function useOrderDetail(orderId, userId) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () =>
      client
        .get(`/api/orders/${orderId}`, { params: { userId } })
        .then((r) => r.data.data.order),
    enabled: !!orderId && !!userId,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, shippingAddress }) =>
      client
        .post("/api/orders", { userId, shippingAddress })
        .then((r) => r.data.data.order),
    onSuccess: (_, { userId }) => {
      qc.invalidateQueries({ queryKey: ["orders", userId] });
      qc.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });
}
