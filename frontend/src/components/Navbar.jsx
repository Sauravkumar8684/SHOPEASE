import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [cartCount, setCartCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

  // ✅ Route change  cart count refresh 
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await API.get("/cart");
        // ✅ Items  — total quantity
        const totalQty = res.data.items?.reduce(
          (acc, item) => acc + item.quantity, 0
        ) || 0;
        setCartCount(totalQty);
      } catch {
        setCartCount(0);
      }
    };
    fetchCart();
  }, [location.pathname]); 

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-3 flex justify-between items-center shadow-xl">

      {/* Logo */}
      <h1
        onClick={() => navigate("/products")}
        className="text-2xl font-bold cursor-pointer hover:text-yellow-400 transition"
      >
        ShopEase 🛍️
      </h1>

      <div className="flex items-center gap-6">

        {/* User Links */}
        <button
          onClick={() => navigate("/products")}
          className="hover:text-yellow-400 transition"
        >
          Products
        </button>

        <button
          onClick={() => navigate("/orders")}
          className="hover:text-yellow-400 transition"
        >
          Orders
        </button>

        {/* Cart with badge */}
        <button
          onClick={() => navigate("/cart")}
          className="relative hover:text-yellow-400 transition"
        >
          Cart🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* ✅ Admin Links */}
        {isAdmin && (
          <div className="flex gap-2 border-l pl-4 border-white/30">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-purple-600 px-3 py-1 rounded text-sm font-bold hover:bg-purple-700 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="bg-gray-800 px-3 py-1 rounded text-sm font-bold hover:bg-gray-700 transition"
            >
              Product Mgmt
            </button>
            {/* ✅ Admin Orders link add  */}
            <button
              onClick={() => navigate("/admin/orders")}
              className="bg-gray-800 px-3 py-1 rounded text-sm font-bold hover:bg-gray-700 transition"
            >
              Orders
            </button>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-yellow-400 text-black px-3 py-1 rounded-lg font-bold hover:bg-yellow-500 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

