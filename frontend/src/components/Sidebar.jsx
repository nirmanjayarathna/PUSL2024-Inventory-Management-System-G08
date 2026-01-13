import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Users,
  LogOut,
} from "lucide-react";

export default function Sidebar({ onLogout }) {
  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/" },
    { icon: <Box size={18} />, label: "Products", path: "/products" },
    { icon: <Users size={18} />, label: "Suppliers", path: "/suppliers" },
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-full bg-slate-900 rounded-tr-2xl rounded-br-2xl shadow-xl flex flex-col justify-between p-4 z-40">


      {/* Profile */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 border border-purple-400 shadow-md"></div>
          <div>
            <p className="text-sm font-semibold text-white">Inventory System</p>
            <p className="text-xs text-gray-400"></p>
          </div>
        </div>

        <hr className="border-slate-700 my-3" />

        <nav className="space-y-2">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-linear-to-r from-slate-700 to-white-700 text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
       <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-1.5 text-sm font-medium rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
      >
        <LogOut size={18} />
        Logout
      </button> 
    </aside>
  );
}
