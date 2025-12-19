import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Users from "../Users/Users";
import Stats from "../Stats/Stats";
import Companies from "../Companies/Companies";
import Offers from "../Offers/Offers";
import Events from "../Events/Events";
import Plans from "../Plans/Plans";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Déterminer la page active basée sur l'URL
  const getActivePage = () => {
    if (location.pathname.startsWith("/users")) return "users";
    if (location.pathname.startsWith("/stats")) return "stats";
    if (location.pathname.startsWith("/companies")) return "companies";
    if (location.pathname.startsWith("/offers")) return "offers";
    if (location.pathname.startsWith("/events")) return "events";
    if (location.pathname.startsWith("/plans")) return "plans";
    return "users";
  };

  return (
    <div className="dashboard">
      <Sidebar activePage={getActivePage()} />
      <div className="dashboard-main">
        <Header user={user} />
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users/*" element={<Users />} />
            <Route path="/events/*" element={<Events />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/companies/*" element={<Companies />} />
            <Route path="/offers/*" element={<Offers />} />
            <Route path="/plans/*" element={<Plans />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
