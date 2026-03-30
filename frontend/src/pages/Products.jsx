import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const navigate = useNavigate();

  // ✅ Search/filter/sort ke saath fetch
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword) params.append("keyword", keyword);
      if (category) params.append("category", category);
      if (sort) params.append("sort", sort);

      const res = await API.get(`/products?${params.toString()}`);
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products ❌");
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // ✅ filter change hone par re-fetch

  const addToCart = async (e, productId) => {
    e.stopPropagation(); // ✅ Card click propagation rokna
    try {
      setLoadingId(productId);
      await API.post("/cart/add", { productId, quantity: 1 });
      toast.success("Added to cart ✅");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error adding to cart ❌");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <button
            onClick={() => navigate("/cart")}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Go to Cart 🛒
          </button>
        </div>

        {/* ✅ Search + Filter + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-gray-300 outline-none"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 outline-none bg-white"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Sports">Sports</option>
            <option value="Books">Books</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 outline-none bg-white"
          >
            <option value="">Sort: Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* ✅ Loading state */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-500 text-lg animate-pulse">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
            {keyword || category ? (
              <button
                onClick={() => { setKeyword(""); setCategory(""); setSort(""); }}
                className="mt-4 text-blue-600 underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
              >
                {/* Image */}
                <img
                  src={p.image || "https://placehold.co/300x200?text=No+Image"}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/300x200?text=No+Image";
                  }}
                />

                {/* Name */}
                <h2 className="font-semibold text-lg mt-2 truncate">
                  {p.name}
                </h2>

                {/* Category */}
                <p className="text-xs text-gray-400 mb-1">{p.category}</p>

                {/* Price */}
                <p className="text-green-600 font-bold text-lg">
                  ₹{p.price.toLocaleString("en-IN")}
                </p>

                {/* ✅ Stock badge */}
                {p.stock === 0 ? (
                  <p className="text-red-500 text-xs mt-1">Out of stock</p>
                ) : p.stock <= 5 ? (
                  <p className="text-orange-500 text-xs mt-1">
                    Only {p.stock} left!
                  </p>
                ) : null}

                {/* Button */}
                <button
                  onClick={(e) => addToCart(e, p._id)}
                  disabled={loadingId === p._id || p.stock === 0}
                  className={`mt-3 w-full py-2 rounded text-white transition ${
                    p.stock === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : loadingId === p._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {p.stock === 0
                    ? "Out of Stock"
                    : loadingId === p._id
                    ? "Adding..."
                    : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;