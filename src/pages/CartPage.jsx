import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart, useUpdateCartItem, useRemoveCartItem } from "../features/cart/useCart";
import { GUEST_USER_ID } from "../utils/guestUser";

function CartPage() {
  const navigate = useNavigate();
  const userId = GUEST_USER_ID;

  const { data: cart, isLoading, isError } = useCart(userId);
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();

  if (isLoading)
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow h-24 animate-pulse" />
        ))}
      </div>
    );

  if (isError)
    return <div className="text-center py-20 text-red-500">Failed to load cart.</div>;

  const items = cart?.items ?? [];

  if (items.length === 0)
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">Your cart is empty.</p>
        <Link to="/" className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm hover:bg-indigo-700 transition">
          Browse Products
        </Link>
      </div>
    );

  function handleQty(itemId, qty) {
    if (qty < 1) return;
    updateItem(
      { userId, itemId, quantity: qty },
      { onError: () => toast.error("Failed to update quantity") }
    );
  }

  function handleRemove(itemId) {
    removeItem(
      { userId, itemId },
      {
        onSuccess: () => toast.success("Item removed"),
        onError: () => toast.error("Failed to remove item"),
      }
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={`https://picsum.photos/seed/${item.productId}/64/64`}
                alt={item.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{item.productName}</p>
              {item.variant?.color && (
                <p className="text-xs text-gray-500">{item.variant.color}{item.variant.size ? ` / ${item.variant.size}` : ""}</p>
              )}
              <p className="text-indigo-600 font-bold text-sm">${Number(item.unitPrice).toFixed(2)}</p>
            </div>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => handleQty(item.id, item.quantity - 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
              >
                −
              </button>
              <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => handleQty(item.id, item.quantity + 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
            <p className="text-sm font-bold text-gray-700 w-16 text-right">
              ${Number(item.subtotal).toFixed(2)}
            </p>
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-400 hover:text-red-600 transition text-lg ml-1"
              aria-label="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <div className="flex justify-between text-lg font-bold text-gray-800">
          <span>Total</span>
          <span className="text-indigo-600">${Number(cart.total).toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default CartPage;
