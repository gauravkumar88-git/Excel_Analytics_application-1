import React from "react";
import { Routes, Route } from "react-router-dom";
import Center from "../components/Center";
import UploadFile from "../components/UploadFile";
import ChartComponent from "../components/ChartComponent";
import History from "../components/History";

const DashboardRoutes = () => {
  return (
   <Routes>
  <Route path="/dashboard/*" element={<Dashboard />}>
    <Route path="center" element={<Center />} />
    <Route path="uploadfile" element={<UploadFile />} />
    <Route path="chartcomponent" element={<ChartComponent />} />  {/* Add here */}
    <Route path="history" element={<History />} />
  </Route>
</Routes>

  );
};

export default DashboardRoutes;
