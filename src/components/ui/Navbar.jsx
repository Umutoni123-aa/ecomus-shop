import { Link } from "react-router-dom";
import { useCart } from "../../features/cart/useCart";
import { GUEST_USER_ID } from "../../utils/guestUser";

function Navbar() {
  const { data: cart } = useCart(GUEST_USER_ID);
  const itemCount = cart?.itemCount ?? 0;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        Ecomus
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="text-gray-600 hover:text-indigo-600 transition">
          Products
        </Link>
        <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600 transition">
          Cart
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </Link>
        <Link to="/orders" className="text-gray-600 hover:text-indigo-600 transition">
          Orders
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
