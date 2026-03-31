
import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        API.get("/users"),
        API.get("/users/stats"),
      ]);
      setUsers(usersRes.data.users || []); 
      setStats(statsRes.data.stats || null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to load data ❌");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchData();
    }
  }, [navigate, fetchData]);

  // ✅ Toggle role function for both promote and demote
  
  const updateRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await API.put(`/users/role/${id}`, { role: newRole });
      toast.success(`Role updated to ${newRole} ✅`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Update failed ❌");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        {/* ✅ Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Users", value: stats.totalUsers },
              { label: "Total Orders", value: stats.totalOrders },
              { label: "Revenue", value: `₹${stats.totalRevenue?.toLocaleString("en-IN")}` },
              { label: "Delivered", value: stats.ordersByStatus?.Delivered || 0 },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 font-medium">{u.name}</td>
                      <td className="p-4 text-gray-600">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {/* ✅ Promote aur demote dono */}
                        <button
                          onClick={() => updateRole(u._id, u.role)}
                          className={`px-4 py-1.5 rounded-lg text-sm text-white transition ${
                            u.role === "admin"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;