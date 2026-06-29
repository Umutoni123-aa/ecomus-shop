import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../features/cart/useCart";
import { usePlaceOrder } from "../features/orders/useOrders";
import { GUEST_USER_ID } from "../utils/guestUser";

const EMPTY_ADDRESS = { street: "", city: "", state: "", zip: "", country: "" };

function CheckoutPage() {
  const navigate = useNavigate();
  const userId = GUEST_USER_ID;
  const { data: cart } = useCart(userId);
  const { mutate: placeOrder, isPending } = usePlaceOrder();
  const [address, setAddress] = useState(EMPTY_ADDRESS);

  const items = cart?.items ?? [];
  if (items.length === 0)
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">Your cart is empty.</p>
        <Link to="/" className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm hover:bg-indigo-700 transition">
          Shop Now
        </Link>
      </div>
    );

  function handleChange(e) {
    setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    placeOrder(
      { userId, shippingAddress: address },
      {
        onSuccess: (order) => {
          toast.success("Order placed successfully!");
          navigate(`/orders/${order.id}`);
        },
        onError: (err) =>
          toast.error(err.response?.data?.message || "Checkout failed, please try again"),
      }
    );
  }

  const inputClass =
    "border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="font-semibold text-gray-700">Shipping Address</h2>
          <input name="street" placeholder="Street address" required value={address.street} onChange={handleChange} className={inputClass} />
          <div className="grid grid-cols-2 gap-3">
            <input name="city" placeholder="City" required value={address.city} onChange={handleChange} className={inputClass} />
            <input name="state" placeholder="State" required value={address.state} onChange={handleChange} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input name="zip" placeholder="ZIP / Postal code" required value={address.zip} onChange={handleChange} className={inputClass} />
            <input name="country" placeholder="Country" required value={address.country} onChange={handleChange} className={inputClass} />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 mt-2"
          >
            {isPending ? "Placing order…" : "Place Order"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4 h-fit">
        <h2 className="font-semibold text-gray-700">Order Summary</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600">
            <span className="truncate flex-1 mr-2">{item.productName} × {item.quantity}</span>
            <span className="font-medium">${Number(item.subtotal).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
          <span>Total</span>
          <span className="text-indigo-600">${Number(cart?.total ?? 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
