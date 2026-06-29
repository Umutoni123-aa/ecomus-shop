import { useState } from "react";
import { useProducts, useCategories } from "./useProducts";
import ProductCard from "./ProductCard";

function ProductsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useProducts({ search, categoryId, page });
  const { data: categories = [] } = useCategories();

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </form>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => { setCategoryId(""); setPage(1); }}
          className={`px-4 py-1.5 rounded-full text-sm border transition ${
            categoryId === ""
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setCategoryId(cat.id); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              categoryId === cat.id
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow h-64 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-red-500">
          Failed to load products: {error?.message}
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="text-center py-12 text-gray-400">No products found.</div>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border text-sm disabled:opacity-40 hover:bg-gray-100 transition"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border text-sm disabled:opacity-40 hover:bg-gray-100 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
