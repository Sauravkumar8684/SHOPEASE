import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 📦 Load all orders (Memoized)
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders/all");
      // Backend response structure ke hisaab se adjust karein (res.data ya res.data.orders)
      setOrders(res.data.orders || res.data); 
    } catch {
      toast.error("Failed to load orders ");
    } finally {
      setLoading(false);
    }
  }, []);

  //  Admin check & Initial Fetch
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchOrders();
    }
  }, [navigate, fetchOrders]);

  // 🔄 Update status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success(`Order set to ${status} `);
      fetchOrders(); // List refresh karein
    } catch {
      toast.error("Status update failed ");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          Manage Orders  <span className="text-sm font-normal text-gray-500">({orders.length} Total)</span>
        </h1>

        {loading ? (
          <p className="text-center py-10 text-gray-500">Fetching orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-xl shadow">No orders found 😢</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-xl shadow-md border-l-8 border-blue-600 transition hover:shadow-lg">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg text-gray-800">Customer: {order.user?.name || "Unknown User"}</p>
                    <p className="text-sm text-gray-500">{order.user?.email}</p>
                    <p className="text-xs text-blue-500 mt-1 font-mono">ID: {order._id}</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-2xl font-black text-gray-900">₹{order.totalPrice}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Items</p>
                  {order.orderItems.map((item, i) => (
                    <div key={i} className="flex justify-between py-1 border-b last:border-0 border-gray-200">
                      <span className="text-gray-700">{item.product?.name} <span className="text-gray-400">× {item.quantity}</span></span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700">Order Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`p-2 rounded-lg border-2 font-bold focus:outline-none ${
                        order.status === "Delivered" ? "border-green-500 text-green-600 bg-green-50" : 
                        order.status === "Shipped" ? "border-blue-500 text-blue-600 bg-blue-50" : "border-yellow-500 text-yellow-600 bg-yellow-50"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <span className="text-xs text-gray-400">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
