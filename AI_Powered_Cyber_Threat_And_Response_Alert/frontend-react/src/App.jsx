import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // <--- Import Dashboard
import Threats from './pages/Threats';
import Remediation from './pages/Remediation';
import SecurityLogs from './pages/SecurityLogs';
import LogAnalysis from './pages/LogAnalysis';
import NetworkScan from './pages/NetworkScan';
import Settings from './pages/Settings';
import Meetteam from './components/Meetteam'; // <--- Import Meetteam

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* <--- Add Route */}
        <Route path="/threats" element={<Threats />} /> {/* <--- Add Route */}
        <Route path="/remediation" element={<Remediation />} /> {/* <--- Add Route */}
        <Route path="/logs" element={<SecurityLogs />} /> {/* <--- Add Route */}
        <Route path="/analysis" element={<LogAnalysis />} /> {/* <--- Add Route */}
        <Route path="/network" element={<NetworkScan />} /> {/* <--- Add Route */}
        <Route path="/settings" element={<Settings />} /> {/* <--- Add Route */}
        <Route path="/meet-team" element={<Meetteam />} /> {/* <--- Add Route */}
      </Routes>
    </Router>
  );
}

export default App;