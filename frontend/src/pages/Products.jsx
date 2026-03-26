import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Products() {
  const [products, setProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

   useEffect(() => {
  API.get("/products")
    .then((res) => {
      const data = res.data.products || res.data;
      setProducts(data);
    })
    .catch((err) => {
      console.log(err);
      toast.error("Failed to load products ");
    });
}, []);

  //  Add to Cart
  const addToCart = async (productId) => {
    try {
      setLoadingId(productId);

      await API.post("/cart/add", {
        productId,
        quantity: 1,
      });

      toast.success("Added to cart ");

    } catch {
      toast.error("Error adding to cart ");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">

      {/* Container */}
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Products
          </h1>

          <button
            onClick={() => navigate("/cart")}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Go to Cart 🛒
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {products.length === 0 ? (
            <p className="text-gray-600">No products available </p>
          ) : (
            products.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-lg p-5 border hover:shadow-2xl transition duration-300"
              >
                {/* Image placeholder */}
                <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    No Image
                  </span>
                </div>

                {/* Product Name */}
                <h2 className="font-bold text-lg text-gray-800">
                  {p.name}
                </h2>

                {/* Price */}
                <p className="text-gray-700 mb-4 font-medium">
                  ₹{p.price}
                </p>

                {/* Button */}
                <button
                  onClick={() => addToCart(p._id)}
                  disabled={loadingId === p._id}
                  className={`w-full py-2 rounded-lg text-white font-medium transition ${
                    loadingId === p._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loadingId === p._id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}

export default Products;