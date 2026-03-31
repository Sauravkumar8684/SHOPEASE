import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const emptyForm = {
  name: "", price: "", image: "",
  description: "", category: "", stock: "",
};

function Admin() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") navigate("/");
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      
      setProducts(res.data.products || []);
    } catch {
      toast.error("Failed to load products ❌");
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // ✅ Reusable handler
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    // ✅ Sab required fields check
    if (!form.name || !form.price || !form.image || !form.description || !form.category) {
      toast.error("All is required fields fill  ❌");
      return false;
    }
    if (Number(form.price) <= 0) {
      toast.error("Price cannot be negetive ❌");
      return false;
    }
    if (Number(form.stock) < 0) {
      toast.error("Stock cannot be negative ❌");
      return false;
    }
    return true;
  };

  const addProduct = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await API.post("/products/add", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
      });
      toast.success("Product added ✅");
      setForm(emptyForm);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error adding product ❌");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await API.put(`/products/${editId}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      toast.success("Product updated ✅");
      setEditId(null);
      setForm(emptyForm);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    // ✅ Confirm before delete

    if (!window.confirm("Sure? product delete !")) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted ✅");
      fetchProducts();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    // ✅ only required fields 
    setForm({
      name: p.name,
      price: p.price,
      image: p.image,
      description: p.description,
      category: p.category,
      stock: p.stock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputClass = "w-full border border-gray-300 p-2 rounded-lg outline-none focus:border-blue-500 mb-3";

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">Admin Panel — Products</h1>

        {/* FORM */}

        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="font-semibold text-lg mb-4">
            {editId ? "Edit Product ✏️" : "Add New Product ➕"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <input name="name" type="text" placeholder="Product Name *"
              value={form.name} onChange={handleChange} className={inputClass} />
            <input name="price" type="number" placeholder="Price *" min="0"
              value={form.price} onChange={handleChange} className={inputClass} />
            <input name="image" type="text" placeholder="Image URL *"
              value={form.image} onChange={handleChange} className={inputClass} />
            <input name="category" type="text" placeholder="Category *"
              value={form.category} onChange={handleChange} className={inputClass} />
            <input name="stock" type="number" placeholder="Stock" min="0"
              value={form.stock} onChange={handleChange} className={inputClass} />
            <input name="description" type="text" placeholder="Description *"
              value={form.description} onChange={handleChange} className={inputClass} />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={editId ? updateProduct : addProduct}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white font-medium transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Saving..." : editId ? "Update Product" : "Add Product"}
            </button>

            {editId && (
              <button
                onClick={() => { setEditId(null); setForm(emptyForm); }}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* PRODUCTS GRID */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
              <img
                src={p.image || "https://placehold.co/300x200?text=No+Image"}
                alt={p.name}
                className="h-32 w-full object-cover rounded-lg mb-3"
                onError={(e) => { e.target.src = "https://placehold.co/300x200?text=No+Image"; }}
              />
              <h3 className="font-semibold truncate">{p.name}</h3>
              <p className="text-green-600 font-bold">
                ₹{Number(p.price).toLocaleString("en-IN")}
              </p>
              {/* ✅ Stock info */}

              <p className={`text-xs mt-1 ${p.stock === 0 ? "text-red-500" : "text-gray-400"}`}>
                Stock: {p.stock === 0 ? "Out of stock" : p.stock}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-lg text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-lg text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;