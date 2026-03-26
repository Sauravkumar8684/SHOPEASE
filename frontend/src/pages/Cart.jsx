import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  // 📦 Load cart
 const fetchCart = async () => {
  try {
    const res = await API.get("/cart");

    const data = res.data.cart || res.data; 
    setCart(data);

  } catch {
    toast.error("Failed to load cart ");
  }
};
  useEffect(() => {
    fetchCart();
  }, []);

  // ❌ Remove item
  const removeItem = async (id) => {
    try {
      setLoadingId(id);

      await API.delete(`/cart/remove/${id}`);

      toast.success("Item removed ");
      fetchCart();

    } catch {
      toast.error("Error removing item ");
    } finally {
      setLoadingId(null);
    }
  };

  //  Checkout
  const checkout = async () => {
    try {
      await API.post("/orders/checkout");

      toast.success("Order placed ");
      setCart({ items: [], total: 0 });

      navigate("/orders");

    } catch {
      toast.error("Checkout failed ");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Cart 🛒</h2>

        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Back to Products
        </button>
      </div>

      {/* Empty */}
      {cart.items.length === 0 ? (
        <p className="text-gray-600">Cart is empty </p>
      ) : (
        cart.items.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 mb-3 rounded shadow"
          >
            <h3 className="font-semibold">
              {item.product.name}
            </h3>

            <p className="text-gray-600">
              ₹{item.product.price} × {item.quantity}
            </p>

            <button
              onClick={() => removeItem(item.product._id)}
              disabled={loadingId === item.product._id}
              className={`mt-2 px-3 py-1 rounded text-white ${
                loadingId === item.product._id
                  ? "bg-gray-400"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loadingId === item.product._id
                ? "Removing..."
                : "Remove"}
            </button>
          </div>
        ))
      )}

      {/* Total */}
      <h3 className="mt-4 text-lg font-bold">
        Total: ₹{cart.total}
      </h3>

      {/* Checkout */}
      {cart.items.length > 0 && (
        <button
          onClick={checkout}
          className="mt-4 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Checkout ✅
        </button>
      )}
    </div>
  );
}

export default Cart;