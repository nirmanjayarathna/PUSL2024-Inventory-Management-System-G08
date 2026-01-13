import React, { useEffect, useState } from "react";
import axios from "axios";
import KpiCard from "../components/KpiCard";

// Icons
import { Box, Users, AlertTriangle, Package } from "lucide-react";

// Charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const prod = await axios.get("http://localhost:8089/api/products");
      const supp = await axios.get("http://localhost:8089/api/suppliers");

      setProducts(prod.data);
      setSuppliers(supp.data);

      // Convert product list into chart data
      const grouped = {};

      prod.data.forEach((p) => {
        if (!grouped[p.category]) grouped[p.category] = 0;
        grouped[p.category] += p.quantity;
      });

      const formatted = Object.entries(grouped).map(([category, qty]) => ({
        category,
        qty,
      }));

      setChartData(formatted);
    } catch (error) {
      console.error("Dashboard load error", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <KpiCard
          title="Total Products"
          value={products.length}
          icon={<Package size={28} />}
          trend={12}
        />

        <KpiCard
          title="Low Stock Items"
          value={products.filter((p) => p.quantity < 5).length}
          icon={<AlertTriangle size={28} />}
          trend={-3}
        />

        <KpiCard
          title="Suppliers"
          value={suppliers.length}
          icon={<Users size={28} />}
          trend={6}
        />

        <KpiCard
          title="Total Stock Count"
          value={products.reduce((acc, p) => acc + p.quantity, 0)}
          icon={<Box size={28} />}
        />
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Stock by Category</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="qty"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
