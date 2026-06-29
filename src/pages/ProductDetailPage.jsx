import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductDetail } from "../features/products/useProducts";
import { useAddToCart } from "../features/cart/useCart";
import { getProductImage } from "../utils/productImage";
import { GUEST_USER_ID } from "../utils/guestUser";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProductDetail(id);
  const { mutate: addToCart, isPending } = useAddToCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="bg-gray-200 rounded-2xl h-96" />
        <div className="flex flex-col gap-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      </div>
    );

  if (isError || !product)
    return (
      <div className="text-center py-20 text-red-500">Product not found.</div>
    );

  const variants = product.variants ?? [];
  const activeVariant = selectedVariant ?? variants[0] ?? null;
  const price = activeVariant?.price ?? product.price ?? 0;
  const image = getProductImage(product, 800, 600);

  function handleAddToCart() {
    addToCart(
      {
        userId: GUEST_USER_ID,
        productId: product.id,
        variantId: activeVariant?.id,
        quantity: qty,
        product,
      },
      {
        onSuccess: () => {
          setAdded(true);
          setTimeout(() => setAdded(false), 3000);
        },
        onError: (err) =>
          toast.error(err.response?.data?.message || "Failed to add to cart"),
      }
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <div className="bg-gray-100 rounded-2xl overflow-hidden h-96">
        <img src={image} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-sm text-indigo-500 font-medium uppercase">
          {product.category?.name}
        </span>
        <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
        <p className="text-3xl font-bold text-indigo-600">${Number(price).toFixed(2)}</p>
        <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

        {variants.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Variant</span>
            <div className="flex gap-2 flex-wrap">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-1.5 rounded-xl border text-sm transition ${
                    (activeVariant?.id === v.id)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  {v.color ?? "Default"}{v.size ? ` / ${v.size}` : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Qty</span>
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition"
            >
              −
            </button>
            <span className="px-4 py-1.5 text-sm font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isPending || added}
          className={`py-3 rounded-xl font-medium transition disabled:opacity-50 mt-2 ${
            added
              ? "bg-green-500 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {isPending ? "Adding…" : added ? "✓ Added to Cart" : "Add to Cart"}
        </button>

        {added && (
          <p className="text-green-600 text-sm font-medium text-center animate-pulse">
            Item added to your cart!
          </p>
        )}

        <p className="text-xs text-gray-400">{product.stock} in stock</p>
      </div>
    </div>
  );
}

export default ProductDetailPage;
