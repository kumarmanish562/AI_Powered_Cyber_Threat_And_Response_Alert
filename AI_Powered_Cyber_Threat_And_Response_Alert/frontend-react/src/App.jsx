import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard'; // <--- Import Dashboard
import Threats from './pages/Threats';
import Remediation from './pages/Remediation';
import SecurityLogs from './pages/SecurityLogs';
import LogAnalysis from './pages/LogAnalysis';
import ForensicsLab from './pages/ForensicsLab';
import CreateCase from './pages/CreateCase';
import NetworkScan from './pages/NetworkScan';
import Settings from './pages/Settings';
import Meetteam from './components/Meetteam';
import ApiDocumentation from './components/ApiDocumentation';
import TechnicalSpecs from './components/TechnicalSpecs'; // <--- Import
import StayUpdated from './components/StayUpdated'; // <--- Import
import ProtectedRoute from './components/ProtectedRoute'; // <--- Import
import Careers from './components/Home/Careers';
import SecurityResearch from './components/SecurityResearch';
import Contact from './components/Home/Contact';
import About from './components/Home/About';

import UserDocumentation from './components/UserDocumentation'; // <--- Import
import { ThemeProvider } from './context/ThemeContext'; // <--- Import ThemeProvider

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/threats" element={<ProtectedRoute><Threats /></ProtectedRoute>} />
          <Route path="/remediation" element={<ProtectedRoute><Remediation /></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><SecurityLogs /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute><ForensicsLab /></ProtectedRoute>} />
          <Route path="/analysis/new" element={<ProtectedRoute><CreateCase /></ProtectedRoute>} />
          <Route path="/log-analysis" element={<ProtectedRoute><LogAnalysis /></ProtectedRoute>} />
          <Route path="/network" element={<ProtectedRoute><NetworkScan /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/meet-team" element={<Meetteam />} />
          <Route path="/documentation" element={<UserDocumentation />} /> {/* <--- Add Route */}
          <Route path="/api-docs" element={<ApiDocumentation />} /> {/* <--- Add Route */}
          <Route path="/technical-specs/:featureId" element={<TechnicalSpecs />} /> {/* <--- Add Route */}
          <Route path="/stay-updated" element={<StayUpdated />} /> {/* <--- Add Route */}
          <Route path="/careers" element={<Careers />} />
          <Route path="/research" element={<SecurityResearch />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;