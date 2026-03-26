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

  const handleRegister = async () => {
    try {
      setLoading(true);

      await API.post("/auth/register", form);

      toast.success("Registered Successfully ");
      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.msg || "Error ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">

      <div className="w-[900px] h-[520px] bg-blue-800 rounded-2xl flex shadow-2xl overflow-hidden">

        {/* LEFT */}
        <div className="w-1/2 flex flex-col justify-center items-start p-10 text-white">
          <h1 className="text-4xl font-bold mb-4">Join Us!</h1>
          <p className="text-sm mb-6 text-gray-200">
            Create your account to get started. Enter your details and become
            part of our platform.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition"
          >
            Already have account?
          </button>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 flex items-center justify-center bg-blue-700">
          <div className="bg-blue-600 p-8 rounded-xl w-80 shadow-lg">

            <h2 className="text-white text-2xl font-semibold mb-5 text-center">
              Register
            </h2>

            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 mb-3 rounded bg-gray-200 outline-none"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email address"
              className="w-full p-2 mb-3 rounded bg-gray-200 outline-none"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-3 rounded bg-gray-200 outline-none"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="w-full p-2 mb-4 rounded bg-gray-200 outline-none"
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
            />

            <button
              onClick={handleRegister}
              disabled={loading}
              className={`w-full py-2 rounded font-medium ${
                loading
                  ? "bg-gray-400 text-white"
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