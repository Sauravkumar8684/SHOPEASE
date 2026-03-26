import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Orders() {
  const [orders, setOrders] = useState([]);

  

useEffect(() => {
  const loadOrders = async () => {
    try {
      const res = await API.get("/orders");
      const data = res.data.orders || res.data;
      setOrders(data);
    } catch {
      toast.error("Failed to load orders ");
    }
  };

  loadOrders();
}, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Orders 📦</h1>

      {orders.length === 0 ? (
        <p>No orders yet </p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white p-4 mb-4 rounded shadow">
            <h2 className="font-semibold mb-2">
              Order ID: {order._id}
            </h2>
           {(order.orderItems || []).map((item, i) => (
        <div key={i} className="text-gray-700">
          {item.product?.name || "Product"} × {item.quantity}
        </div>
      ))}

            <p className="mt-2 font-bold">
              Total: ₹{order.totalPrice}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;