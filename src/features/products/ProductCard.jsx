import { Link } from "react-router-dom";
import { getProductImage } from "../../utils/productImage";

function ProductCard({ product }) {
  const image = getProductImage(product, 400, 300);
  const price = product.variants?.[0]?.price ?? product.price ?? 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden flex flex-col"
    >
      <div className="h-48 bg-gray-100 overflow-hidden">
        <img src={image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <span className="text-xs text-indigo-500 font-medium uppercase">
          {product.category?.name ?? "General"}
        </span>
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
        <p className="mt-auto pt-2 font-bold text-indigo-600">${Number(price).toFixed(2)}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
