import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-700 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <h2
              onClick={() => navigate("/products")}
              className="text-2xl font-bold cursor-pointer hover:text-yellow-400 transition mb-2"
            >
              ShopEase 🛍️
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your one-stop destination for quality products at the best prices.
              Shop smart, shop easy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-yellow-400 mb-3 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button
                  onClick={() => navigate("/products")}
                  className="hover:text-white transition"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/cart")}
                  className="hover:text-white transition"
                >
                  My Cart
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/orders")}
                  className="hover:text-white transition"
                >
                  My Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Admin Links ya Support */}
          <div>
            {isAdmin ? (
              <>
                <h3 className="font-semibold text-yellow-400 mb-3 text-sm uppercase tracking-wider">
                  Admin
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="hover:text-white transition"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/admin")}
                      className="hover:text-white transition"
                    >
                      Manage Products
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/admin/orders")}
                      className="hover:text-white transition"
                    >
                      Manage Orders
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-yellow-400 mb-3 text-sm uppercase tracking-wider">
                  Support
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>support@shopease.in</li>
                  <li>+91 98765 43210</li>
                  <li>Mon–Sat, 9am–6pm</li>
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-400">
          <p>© {year} ShopEase. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;