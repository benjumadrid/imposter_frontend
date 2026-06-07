import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Nav from "./components/Nav";
import Face from "./components/face";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import BuyingItems from "./components/BuyingItems";
import BuyingHistory from "./components/BuyingHistory";
import SalesItems from "./components/SalesItems";
import SalesHistory from "./components/SalesHistory";
import Report from "./components/Report";
import Inventory from "./components/inventory.jsx";
import Loan from "./components/loan.jsx";
import LoanHistory from "./components/LoanHistory.jsx";  
import Loading from "./components/Loading";

function AppContent() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") return;

    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      <Nav />
      {location.pathname !== "/" && <Loading isVisible={loading} />}

      <Routes>
        <Route path="/" element={<Face />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/buying-items" element={<BuyingItems />} />
        <Route path="/buying-history" element={<BuyingHistory />} />
        <Route path="/sales-items" element={<SalesItems />} />
        <Route path="/sales-history" element={<SalesHistory />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/loan" element={<Loan />} />                     {/* Loan Form */}
        <Route path="/loan-history" element={<LoanHistory />} />     {/* Loan History Page */}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
