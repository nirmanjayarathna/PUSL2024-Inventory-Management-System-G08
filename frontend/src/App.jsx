// Main Routing Configuration for React Frontend
import { Routes, Route, Navigate, useLocation } from "react-router-dom";  
import { useEffect, useState } from "react";
import Login from "./Login";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import { PageTitleProvider, usePageTitle } from "./context/PageTitleContext";

function AppContent({ onLogout }) {
  const location = useLocation();
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    const current = location.pathname;
    if (current === "/") setPageTitle("Dashboard");
    if (current.includes("products")) setPageTitle("Products");
    if (current.includes("suppliers")) setPageTitle("Suppliers");
  }, [location.pathname, setPageTitle]);

  return (
    <>
      <Sidebar onLogout={onLogout} />
      
      <main className="ml-64 p-4 bg-white min-h-screen">


        <Routes>
          
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("user")
  );

  const handleLogout = () => {
  localStorage.removeItem("user");
  setIsLoggedIn(false);
};


  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <PageTitleProvider>
  <AppContent onLogout={handleLogout} />
</PageTitleProvider>

  );
}
