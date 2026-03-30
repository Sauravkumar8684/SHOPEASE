import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loadingId, setLoadingId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      
      setCart({
        items: res.data.items || [],
        total: res.data.total || 0,
      });
    } catch {
      toast.error("Failed to load cart ❌");
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (productId) => {
    try {
      setLoadingId(productId);
      await API.delete(`/cart/remove/${productId}`);
      toast.success("Item removed ✅");
      fetchCart();
    } catch {
      toast.error("Error removing item ❌");
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ Quantity update
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      return removeItem(productId);
    }
    try {
      setLoadingId(productId);
      await API.put(`/cart/update/${productId}`, { quantity });
      fetchCart();
    } catch {
      toast.error("Error updating quantity ❌");
    } finally {
      setLoadingId(null);
    }
  };

  const checkout = async () => {
    try {
      setCheckingOut(true);
      await API.post("/orders/checkout");
      toast.success("Order placed ✅");
      setCart({ items: [], total: 0 });
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Checkout failed ❌");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Cart 🛒</h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Back to Products
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Cart is empty 🛒</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <>
            {cart.items.map((item) => (
              <div key={item._id} className="bg-white p-4 mb-3 rounded-xl shadow flex gap-4 items-center">

                {/* Image */}
                <img
                  src={item.product?.image || "https://placehold.co/80x80?text=?"}
                  alt={item.product?.name}
                  className="w-16 h-16 object-cover rounded"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product?.name}</h3>
                  <p className="text-green-600 font-bold">
                    ₹{item.product?.price.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* ✅ Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    disabled={loadingId === item.product._id}
                    className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-bold"
                  >−</button>
                  <span className="w-6 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    disabled={loadingId === item.product._id}
                    className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-bold"
                  >+</button>
                </div>

                {/* Subtotal */}
                <p className="font-bold text-gray-700 w-24 text-right">
                  ₹{(item.product?.price * item.quantity).toLocaleString("en-IN")}
                </p>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product._id)}
                  disabled={loadingId === item.product._id}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                >×</button>
              </div>
            ))}

            {/* Total + Checkout */}
            <div className="bg-white rounded-xl shadow p-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total:</span>
                {/* ✅ Formatted price */}
                <span className="text-xl font-bold text-green-600">
                  ₹{cart.total.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                onClick={checkout}
                disabled={checkingOut}
                className={`w-full py-3 rounded-lg text-white font-bold transition ${
                  checkingOut
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {checkingOut ? "Placing Order..." : "Checkout ✅"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;