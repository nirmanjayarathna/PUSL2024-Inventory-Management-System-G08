import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8089";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const fetchSuppliers = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/suppliers`);
    setSuppliers(res.data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post(`${API_BASE_URL}/api/suppliers`, form);
    setForm({ name: "", email: "", phone: "", company: "" });
    fetchSuppliers();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this supplier?")) return;
    await axios.delete(`${API_BASE_URL}/api/suppliers/${id}`);
    fetchSuppliers();
  };

  const openEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setForm({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      company: supplier.company,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await axios.put(
      `${API_BASE_URL}/api/suppliers/${selectedSupplier.id}`,
      form
    );
    setIsEditOpen(false);
    setSelectedSupplier(null);
    fetchSuppliers();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold mb-4">Suppliers</h1>

      {/* Add Supplier Form */}
      <section className="bg-white rounded-xl shadow p-4 md:p-6">
        <h2 className="text-lg  font-semibold mb-2">
          Add Supplier
        </h2>

        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Supplier Name *
            </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleInputChange}
             className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            value={form.name}
            required
          />
            </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Email *
            </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
             className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            value={form.email}
            required
          />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Phone *
            </label>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleInputChange}
             className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            value={form.phone}
            required
          />
            </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Company *
            </label>
          <input
            type="text"
            name="company"
            placeholder="Company"
            onChange={handleInputChange}
             className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            value={form.company}
            required
          />
            </div>
          <div  className="md:col-span-2 flex justify">
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-sm md:col-span-2"
          >
            Add Supplier
          </button>
          </div>
        </form>
      </section>

      {/* Supplier Table */}
      <section className="bg-white rounded-xl shadow p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Suppliers List
        </h2>

        <table className="w-full text-sm text-left text-slate-700">
          <thead className="bg-slate-200 text-xs">
            <tr>
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">Phone</th>
              <th className="px-2 py-2">Company</th>
              <th className="px-2 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="">
                <td className="px-2 py-2">{s.name}</td>
                <td className="px-2 py-2">{s.email}</td>
                <td className="px-2 py-2">{s.phone}</td>
                <td className="px-2 py-2">{s.company}</td>
                <td className="px-2 py-2 text-center space-x-2">
                  <button
                    onClick={() => openEdit(s)}
                    className="text-xs bg-blue-800 text-white px-2 py-0.5 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-xs bg-red-700 text-white px-2 py-0.5 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Edit Supplier</h3>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                value={form.name}
                onChange={handleInputChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                value={form.email}
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                value={form.phone}
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                name="company"
                placeholder="Company"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                value={form.company}
                onChange={handleInputChange}
                required
              />

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
                  className="bg-blue-700 hover:bg-blue-800 text-white text-sm px-4 py-2 rounded-lg"
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
