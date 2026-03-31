import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
         
        setProduct(res.data.product);
      } catch {
        setError(true);
        toast.error("Failed to load product ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Add to cart from detail page
  const addToCart = async () => {
    try {
      setAddingToCart(true);
      await API.post("/cart/add", { productId: id, quantity: 1 });
      toast.success("Added to cart ✅");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error adding to cart ❌");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 animate-pulse text-lg">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
        <p className="text-red-500 text-lg">Product not found ❌</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}

        <button
          onClick={() => navigate("/products")}
          className="mb-4 text-gray-600 hover:text-black transition flex items-center gap-1"
        >
          ← Back to Products
        </button>

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex flex-col md:flex-row gap-8">

            {/* Image */}

            <img
              src={product.image || "https://placehold.co/400x300?text=No+Image"}
              alt={product.name}
              className="w-full md:w-1/2 h-72 object-cover rounded-lg"
              onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
            />

            {/* Info */}

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>

              <p className="text-xs text-gray-400 mb-3">
                Category: {product.category}
              </p>

              <p className="text-green-600 text-2xl font-bold mb-3">
                ₹{product.price.toLocaleString("en-IN")}
              </p>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {product.description}
              </p>

              {/* ✅ Stock info */}

              {product.stock === 0 ? (
                <p className="text-red-500 font-medium mb-4">Out of Stock</p>
              ) : product.stock <= 5 ? (
                <p className="text-orange-500 text-sm mb-4">
                  Only {product.stock} left!
                </p>
              ) : (
                <p className="text-green-500 text-sm mb-4">In Stock</p>
              )}

              {/* ✅ Add to Cart button */}

              <button
                onClick={addToCart}
                disabled={addingToCart || product.stock === 0}
                className={`w-full py-3 rounded-lg text-white font-bold transition ${
                  product.stock === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : addingToCart
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : addingToCart
                  ? "Adding..."
                  : "Add to Cart 🛒"}
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full mt-2 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;