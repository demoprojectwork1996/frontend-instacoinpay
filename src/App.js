import React from "react";
import { Routes, Route } from "react-router-dom";
import MaintenancePage from "./Component/MaintenancePage";

function App() {
  return (
    <Routes>
      <Route path="*" element={<MaintenancePage />} />
    </Routes>
  );
}

export default App;