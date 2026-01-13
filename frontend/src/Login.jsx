// src/Login.jsx
import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8089";

export default function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form);
      // store user for future
      localStorage.setItem("user", JSON.stringify(res.data));
      setIsLoggedIn(true);
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6">
        <h2 className="text-lg font-bold text-center text-slate-800">
          Inventory System Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 text-sm"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
