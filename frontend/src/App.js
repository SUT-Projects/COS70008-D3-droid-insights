import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// ——— User pages ———
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import PredictionResult from "./pages/PredictionResult";
import TotalScan from "./pages/TotalScan";
import ActivityLog from "./pages/ActivityLog";

// ——— Admin pages ———
import AdminLogin from "./pages/AdminLogin";
import HiddenBehaviour from "./pages/HiddenBehaviour";
import FastClassification from "./pages/FastClassification";
import MalwareEvaluation from "./pages/MalwareEvaluation";
import UserManagement from "./pages/UserManagement";
import DataLeakage from "./pages/DataLeakage";
import UploadDataset from './pages/UploadDataset';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User flows */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<UploadDataset />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/result" element={<PredictionResult />} />
        <Route path="/totalscan" element={<TotalScan />} />
        <Route path="/history" element={<ActivityLog />} />

        {/* Admin flows */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/hidden-behaviour" element={<HiddenBehaviour />} />
        <Route path="/fast-classification" element={<FastClassification />} />
        <Route path="/malware-evaluation" element={<MalwareEvaluation />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/data-leakage" element={<DataLeakage />} />

        {/* Catch-all → back to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
