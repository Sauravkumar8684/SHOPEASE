import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  //  Admin Check 
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

    useEffect(() => {
    
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await API.get("/cart");
          setCartCount(res.data.items?.length || 0);
        }
      } catch {
        setCartCount(0);
      }
    };

    fetchCart();
  }, []); 


  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-3 flex justify-between items-center shadow-xl">
      <h1 onClick={() => navigate("/products")} className="text-2xl font-bold cursor-pointer hover:text-yellow-400 transition">ShopEase 🛍️</h1>
      
      <div className="flex items-center gap-6">
        <button onClick={() => navigate("/products")} className="hover:text-yellow-400">Products</button>
        <button onClick={() => navigate("/orders")} className="hover:text-yellow-400">Orders</button>
        <button onClick={() => navigate("/cart")} className="relative hover:text-yellow-400">
          Cart 🛒 {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
        </button>

        {/* 👑 Admin Specific Links */}
        {isAdmin && (
          <div className="flex gap-2 border-l pl-4 border-white/30">
            <button onClick={() => navigate("/dashboard")} className="bg-purple-600 px-3 py-1 rounded text-sm font-bold">Dashboard</button>
            <button onClick={() => navigate("/admin")} className="bg-gray-800 px-3 py-1 rounded text-sm font-bold">Admin Panel</button>
          </div>
        )}

        <button onClick={handleLogout} className="bg-yellow-400 text-black px-3 py-1 rounded-lg font-bold">Logout</button>
      </div>
    </nav>
  );
}
export default Navbar;
