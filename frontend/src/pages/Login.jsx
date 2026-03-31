import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Reusable handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.email || !form.password) {
      toast.error("Email and password  required  ❌");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Valid email daalo ❌");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);

      // Token check 
      
      if (!res.data.token) throw new Error("Token missing in response");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(`Welcome back, ${res.data.user.name}! ✅`);

      // ✅ Role based redirect
      if (res.data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/products");
      }

    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">

      {/* ✅ Responsive */}

      <div className="w-full max-w-4xl bg-blue-800 rounded-2xl flex flex-col md:flex-row shadow-2xl overflow-hidden text-white">

        {/* LEFT */}

        <div className="md:w-1/2 flex flex-col justify-center p-10">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="mb-6 opacity-80 text-sm">
            Enter your credentials to access your account.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg w-fit hover:bg-yellow-400 hover:text-black transition"
          >
            Create Account
          </button>
        </div>

        {/* RIGHT */}
        <div className="md:w-1/2 bg-blue-700 flex items-center justify-center p-8">
          <div className="bg-blue-600 p-6 rounded-xl w-full max-w-xs shadow-lg">

            <h2 className="text-white text-2xl font-semibold mb-6 text-center">
              Login
            </h2>

            {/* ✅ value + name — controlled inputs */}
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              className="w-full p-2 mb-4 rounded bg-gray-100 outline-none text-black"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              className="w-full p-2 mb-5 rounded bg-gray-100 outline-none text-black"
              onChange={handleChange}
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-2 rounded font-bold transition ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-yellow-400 text-black hover:bg-yellow-500"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;