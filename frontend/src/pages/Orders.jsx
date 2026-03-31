import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

// ✅ Status badge helper
const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: "bg-green-100 text-green-700",
    Shipped: "bg-blue-100 text-blue-700",
    Processing: "bg-purple-100 text-purple-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || "bg-gray-100"}`}>
      {status}
    </span>
  );
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data.orders || []);
      } catch {
        toast.error("Failed to load orders ❌");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Orders 📦</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No orders yet 📭</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white p-5 mb-4 rounded-xl shadow">

              {/* Order Header */}
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs text-gray-400 font-mono">#{order._id}</p>
                <StatusBadge status={order.status} />
              </div>

              {/* Items */}
              
              <div className="border-t pt-3 mb-3">
                {(order.orderItems || []).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-700 py-1">
                    <span>{item.product?.name || "Product"} × {item.quantity}</span>
                    <span>₹{(item.product?.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}

              <div className="flex justify-between items-center border-t pt-3">

                {/* ✅ Date */}

                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </p>
                <p className="font-bold text-green-600">
                  ₹{order.totalPrice.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;