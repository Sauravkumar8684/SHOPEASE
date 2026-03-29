import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch(() => {
        toast.error("Failed to load product");
      });
  }, [id]);

  if (!product) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover rounded"
        />

        <h1 className="text-2xl font-bold mt-4">
          {product.name}
        </h1>

        <p className="text-green-600 text-xl font-semibold">
          ₹{product.price}
        </p>

        <p className="mt-2 text-gray-700">
          {product.description}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Category: {product.category}
        </p>

      </div>
    </div>
  );
}

export default ProductDetails;