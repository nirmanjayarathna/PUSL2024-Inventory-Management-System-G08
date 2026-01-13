// src/pages/Products.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8089";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    image: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.category || !form.quantity || !form.price) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("category", form.category);
      data.append("quantity", form.quantity);
      data.append("price", form.price);
      if (form.image) {
        data.append("image", form.image);
      }

      await axios.post(`${API_BASE_URL}/api/products/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Product added successfully!");
      setForm({
        name: "",
        category: "",
        quantity: "",
        price: "",
        image: null,
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to add product.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product.");
    }
  };

  const handleStockChange = async (id, change) => {
    try {
      if (change > 0) {
        await axios.put(
          `${API_BASE_URL}/api/products/stock-in/${id}?amount=${change}`
        );
      } else {
        await axios.put(
          `${API_BASE_URL}/api/products/stock-out/${id}?amount=${Math.abs(
            change
          )}`
        );
      }
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Stock update failed");
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      image: null,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("category", form.category);
      data.append("quantity", form.quantity);
      data.append("price", form.price);
      if (form.image) {
        data.append("image", form.image);
      }

      await axios.put(
        `${API_BASE_URL}/api/products/update/${selectedProduct.id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setIsEditOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  const getImageUrl = (p) => {
    if (!p.imagePath) return null;
    return `${API_BASE_URL}/product-images/${p.imagePath}`;
  };

  return (
    <div className="space-y-6">
    
      <h1 className="text-xl font-semibold mb-2">Products List</h1>
     
      

      {/* Products List */}
      <section className="bg-white rounded-xl shadow p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          
          {loading && (
            <span className="text-xs text-slate-500">Loading...</span>
          )}
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-slate-500">
            No products found. Add your first product above.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col"
              >
                {getImageUrl(p) ? (
                  <img
                    src={getImageUrl(p)}
                    alt={p.name}
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <div className="h-36 w-full flex items-center justify-center bg-slate-200 text-xs text-slate-600">
                    No Image
                  </div>
                )}
                <div className="p-3 space-y-1 flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500">{p.category}</p>
                  <p className="text-xs text-slate-600">
                    Qty: <span className="font-medium">{p.quantity}</span>
                    {p.quantity <= 5 && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white">
                        Low Stock
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-600">
                    Price:{" "}
                    <span className="font-semibold">
                      LKR {Number(p.price).toFixed(2)}
                    </span>
                  </p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleStockChange(p.id, 1)}
                      className="text-xs bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700"
                    >
                      + Stock
                    </button>
                    <button
                      onClick={() => handleStockChange(p.id, -1)}
                      className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700"
                    >
                      - Stock
                    </button>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Product Form */}
      <section className="bg-white rounded-xl shadow p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Add New Product
        </h2>

        {error && (
          <div className="mb-3 rounded-md bg-red-100 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 rounded-md bg-emerald-100 text-emerald-700 px-3 py-2 text-sm">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              placeholder="e.g. Samsung TV"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              placeholder="e.g. Electronics"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              placeholder="e.g. 10"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Price (LKR) *
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              placeholder="e.g. 999.99"
              min="0"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Product Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-slate-700"
            />
            <p className="text-xs text-slate-500">
              Choose an image from your local disk to represent the product.
            </p>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
            >
              Save Product
            </button>
          </div>
        </form>
      </section>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Edit Product</h3>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  New Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
