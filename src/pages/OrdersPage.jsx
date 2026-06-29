import { Link } from "react-router-dom";
import { useOrders } from "../features/orders/useOrders";
import { GUEST_USER_ID } from "../utils/guestUser";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function OrdersPage() {
  const userId = GUEST_USER_ID;
  const { data: orders = [], isLoading, isError } = useOrders(userId);

  if (isLoading)
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow h-20 animate-pulse" />
        ))}
      </div>
    );

  if (isError)
    return <div className="text-center py-20 text-red-500">Failed to load orders.</div>;

  if (orders.length === 0)
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">No orders yet.</p>
        <Link to="/" className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm hover:bg-indigo-700 transition">
          Start Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Your Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="bg-white rounded-2xl shadow p-5 flex items-center justify-between hover:shadow-md transition"
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-800">
                Order #{order.id.slice(-8).toUpperCase()}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length ?? 0} items
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                {order.status}
              </span>
              <p className="font-bold text-indigo-600">${Number(order.total).toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;
