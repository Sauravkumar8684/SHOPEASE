import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrder";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ✅ User Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// ✅ Admin Protected Route
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.role === "admin"
    ? children
    : <Navigate to="/" replace />;
};

// ✅ App Content
function AppContent() {
  const location = useLocation();

  // Login aur Register  Navbar/Footer hide 
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen">

      {/* Navbar — Login/Register not visible */}
      {!hideLayout && <Navbar />}

      {/* Toast Notifications */}
      <Toaster position="top-right" />

      {/* Main Content */}
      <main className="flex-1">
        <Routes>

          
          <Route
            path="/"
            element={
              localStorage.getItem("token")
                ? <Navigate to="/products" replace />
                : <Navigate to="/login" replace />
            }
          />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          {/* ✅ 404 — any wrong url redirect will be done */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>

      {/* Footer — Login/Register not be visible */}
      {!hideLayout && <Footer />}

    </div>
  );
}

// Main App
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;