import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.email || !form.password) return toast.error("Enter all fields!");
    
    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);

     
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); 

      toast.success(`Welcome ${res.data.user.name} `);

      
      if (res.data.user.role === "admin") {
        navigate("/dashboard"); 
      } else {
        navigate("/products");
      }

    } catch (err) {
      toast.error(err.response?.data?.msg || "Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-900">
      <div className="w-[900px] h-[500px] bg-blue-800 rounded-2xl flex shadow-2xl overflow-hidden text-white">
        {/* LEFT */}
        <div className="w-1/2 flex flex-col justify-center p-10">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="mb-6 opacity-80">Enter credentials to access your account.</p>
          <button onClick={() => navigate("/register")} className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg w-fit">Create Account</button>
        </div>
        {/* RIGHT */}
        <div className="w-1/2 bg-blue-700 flex items-center justify-center p-8">
          <div className="bg-blue-600 p-6 rounded-xl w-full max-w-xs shadow-lg text-black">
            <h2 className="text-white text-2xl font-semibold mb-6 text-center">Login</h2>
            <input type="email" placeholder="Email" className="w-full p-2 mb-4 rounded bg-gray-100 outline-none" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Password" className="w-full p-2 mb-5 rounded bg-gray-100 outline-none" onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button onClick={handleLogin} disabled={loading} className={`w-full py-2 rounded font-bold ${loading ? "bg-gray-400" : "bg-yellow-400 hover:bg-yellow-500"}`}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
