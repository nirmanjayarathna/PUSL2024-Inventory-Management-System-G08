import React from "react";

export default function KpiCard({ title, value, icon, trend }) {
  return (
    <div className="  bg-gray-900/200
  backdrop-blur-md
  rounded-xl
  p-5
  shadow-lg
  border border-gray-800/300
  flex flex-col justify-between
  hover:shadow-xl
  transition-all
  text-white">
      <div className="flex items-center justify-between">
        <div className="text-gray-500 text-sm font-medium">{title}</div>
        <div className="text-slate-800">{icon}</div>
      </div>

      <div className="text-3xl font-bold mt-2 text-slate-900">{value}</div>

      {trend && (
        <div className="text-sm mt-2">
          <span
            className={
              trend > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"
            }
          >
            {trend > 0 ? `▲ ${trend}%` : `▼ ${Math.abs(trend)}%`}
          </span>{" "}
          <span className="text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
}
