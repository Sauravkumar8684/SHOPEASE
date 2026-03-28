import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Admin() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    Image: "",
    description: "",
    category: "",
    stock: "",
  });

  // 🔐 Admin check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  // 📦 Load products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products ");
    }
  };

  useEffect(() => {
      const load = async () => {
        await fetchProducts();
      };
      load();
  }, []);
    
 

  // ➕ ADD PRODUCT
  const addProduct = async () => {
    if (!form.name || !form.price) {
      return toast.error("Fill required fields ");
    }

    try {
      await API.post("/products/add", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });

      toast.success("Product added ");

      setForm({
        name: "",
        price: "",
        ImageUrl: "",
        description: "",
        category: "",
        stock: "",
      });

      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error ");
    }
  };

  // ✏️ UPDATE PRODUCT
  const updateProduct = async () => {
    try {
      await API.put(`/products/${editId}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });

      toast.success("Updated ");

      setEditId(null);

      setForm({
        name: "",
        price: "",
        ImageUrl: "",
        description: "",
        category: "",
        stock: "",
      });

      fetchProducts();
    } catch {
      toast.error("Update failed ");
    }
  };

  //  DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      toast.success("Deleted ");
      fetchProducts();
    } catch {
      toast.error("Delete failed ");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Admin Panel 
      </h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-3">
          {editId ? "Edit Product " : "Add Product ➕"}
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 mr-2 mb-2"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 mr-2 mb-2"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={form.ImageUrl}
          onChange={(e) => setForm({ ...form, ImageUrl: e.target.value })}
          className="border p-2 mr-2 mb-2"
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 mr-2 mb-2"
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 mr-2 mb-2"
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border p-2 mr-2 mb-2"
        />

        <br />

        <button
          onClick={editId ? updateProduct : addProduct}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow">

            <img
              src={p.ImageUrl || "https://via.placeholder.com/150"}
              alt={p.name}
              className="h-32 w-full object-cover mb-2"
            />

            <h3 className="font-semibold">{p.name}</h3>
            <p>₹{p.price}</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setEditId(p._id);
                  setForm(p);
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(p._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;