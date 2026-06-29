import { useParams, Link } from "react-router-dom";
import { useOrderDetail } from "../features/orders/useOrders";
import { GUEST_USER_ID } from "../utils/guestUser";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function OrderDetailPage() {
  const { id } = useParams();
  const userId = GUEST_USER_ID;
  const { data: order, isLoading, isError } = useOrderDetail(id, userId);

  if (isLoading)
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow h-20" />
        ))}
      </div>
    );

  if (isError || !order)
    return <div className="text-center py-20 text-red-500">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Confirmed 🎉</h1>
          <p className="text-sm text-gray-500 mt-1">#{order.id.slice(-8).toUpperCase()}</p>
        </div>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
          {order.status}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-gray-700">Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <div>
              <p className="font-medium text-gray-800">{item.product?.name}</p>
              <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
            </div>
            <p className="font-bold text-gray-700">
              ${Number(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
        <div className="border-t pt-4 flex justify-between font-bold text-gray-800">
          <span>Total</span>
          <span className="text-indigo-600">${Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Placed on {new Date(order.createdAt).toLocaleString()}
      </p>

      <div className="flex gap-3 justify-center">
        <Link to="/orders" className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-xl text-sm hover:bg-indigo-50 transition">
          All Orders
        </Link>
        <Link to="/" className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm hover:bg-indigo-700 transition">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderDetailPage;
