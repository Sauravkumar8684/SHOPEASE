import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrder"; 


//  Protected Route (User)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
};


// 🔐 Admin Route
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user && user.role === "admin"
    ? children
    : <Navigate to="/" />;
};


// 👉 Wrapper component
function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Hide Navbar on Login/Register */}
      {location.pathname !== "/login" &&
        location.pathname !== "/register" && <Navbar />}

      <Toaster position="top-right" />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Protected */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
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

        {/* Admin Protected */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 🔥 NEW: Admin Orders */}
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
      </Routes>
    </>
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