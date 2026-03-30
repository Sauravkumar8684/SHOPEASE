import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.phoneNumber) {
      toast.error(" fields required  ❌");
      return false;
    }
    if (form.password.length < 6) {
      toast.error("Password must be 6 characters  long ❌");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Valid email address required ❌");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) {
      toast.error("Valid 10-digit Indian phone number  ❌");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    // ✅ Client-side validation before API call
    if (!validate()) return;

    try {
      setLoading(true);
      await API.post("/auth/register", form);
      toast.success("Registration successful ✅");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">

      {/* ✅ Responsive width */}
      <div className="w-full max-w-4xl bg-blue-800 rounded-2xl flex flex-col md:flex-row shadow-2xl overflow-hidden">

        {/* LEFT */}
        <div className="md:w-1/2 flex flex-col justify-center items-start p-10 text-white">
          <h1 className="text-4xl font-bold mb-4">Join Us!</h1>
          <p className="text-sm mb-6 text-gray-200">
            Create your account to get started. Enter your details and become
            part of our platform.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition"
          >
            Already have an account?
          </button>
        </div>

        {/* RIGHT */}
        <div className="md:w-1/2 flex items-center justify-center bg-blue-700 p-6">
          <div className="bg-blue-600 p-8 rounded-xl w-full max-w-sm shadow-lg">

            <h2 className="text-white text-2xl font-semibold mb-5 text-center">
              Register
            </h2>

            {/* ✅ value prop + name attribute — controlled inputs */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              className="w-full p-2 mb-3 rounded bg-gray-200 outline-none"
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              className="w-full p-2 mb-3 rounded bg-gray-200 outline-none"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={form.password}
              className="w-full p-2 mb-3 rounded bg-gray-200 outline-none"
              onChange={handleChange}
            />

            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (10 digits)"
              value={form.phoneNumber}
              className="w-full p-2 mb-4 rounded bg-gray-200 outline-none"
              onChange={handleChange}
            />

            <button
              onClick={handleRegister}
              disabled={loading}
              className={`w-full py-2 rounded font-medium transition ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-yellow-400 text-black hover:bg-yellow-500"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;