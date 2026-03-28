import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Products() {
  const [products, setProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const data = res.data.products || res.data;
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load products");
      });
  }, []);

  // Add to cart
  const addToCart = async (productId) => {
    try {
      setLoadingId(productId);

      await API.post("/cart/add", {
        productId,
        quantity: 1,
      });

      toast.success("Added to cart");
    } catch (err) {
      console.log(err);
      toast.error("Error adding to cart");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Products
          </h1>

          <button
            onClick={() => navigate("/cart")}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
          >
            Go to Cart 🛒
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {products.length === 0 ? (
            <p className="text-gray-600">No products available</p>
          ) : (
            products.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
              >
                {/* Image */}
              <img
                src={p.image || "https://via.placeholder.com/300"}
                alt={p.name}
                 className="w-full h-40 object-cover rounded"
             />

                {/* Name */}
                <h2 className="font-semibold text-lg mt-2">
                  {p.name}
                </h2>

                {/* Price */}
                <p className="text-green-600 font-bold">
                  ₹{p.price}
                </p>

                {/* Button */}
                <button
                  onClick={() => addToCart(p._id)}
                  disabled={loadingId === p._id}
                  className={`mt-2 w-full py-2 rounded text-white ${
                    loadingId === p._id
                      ? "bg-gray-400"
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