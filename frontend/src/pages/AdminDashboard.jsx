
import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 📦 Fetch Users (Memoized to prevent warning)
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to load users ");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔐 Admin check & initial load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchUsers();
    }
  }, [navigate, fetchUsers]);

  // 🔄 Make Admin Logic
  const makeAdmin = async (id) => {
    try {
      await API.put(`/users/role/${id}`, { role: "admin" });
      toast.success("User is now Admin ");
      fetchUsers(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.msg || "Update failed ");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          Admin Dashboard <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Users Control</span>
        </h1>

        {loading ? (
          <div className="text-center py-10">Loading users...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-4 font-semibold">User Name</th>
                  <th className="p-4 font-semibold">Email Address</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="4" className="p-10 text-center text-gray-500">No users found.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-700">{u.name}</td>
                      <td className="p-4 text-gray-600">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {u.role !== "admin" ? (
                          <button
                            onClick={() => makeAdmin(u._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition shadow-md"
                          >
                            Promote to Admin
                          </button>
                        ) : (
                          <span className="text-gray-400 italic text-sm">Super User</span>
                        )}
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
