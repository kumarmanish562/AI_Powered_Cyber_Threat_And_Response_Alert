import React, { useState } from 'react';
import { ShieldCheck, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/subscribe', { email });
      navigate('/stay-updated');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-white">CyberSentinels</span>
            </Link>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              India’s next-gen AI-powered cyber defense system. Monitor, detect,
              and neutralize threats in real-time.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition"><Twitter size={20} /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition"><Github size={20} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/dashboard" className="hover:text-blue-500 transition">Live Threat Monitor</Link></li>
              <li><Link to="/network" className="hover:text-blue-500 transition">Network Scanner</Link></li>
              <li><Link to="/analysis" className="hover:text-blue-500 transition">Log Analysis</Link></li>
              <li><Link to="/api-docs" className="hover:text-blue-500 transition">API Documentation</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="/#about" className="hover:text-blue-500 transition">About Us</a></li>
              <li><Link to="/careers" className="hover:text-blue-500 transition">Careers</Link></li>
              <li><Link to="/research" className="hover:text-blue-500 transition">Security Research</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
            <p className="text-slate-500 text-sm mb-4">Get the latest security alerts.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-lg text-sm w-full focus:border-blue-500 outline-none"
                required
              />
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Mail size={18} />}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-600 text-xs">
          <p>© {new Date().getFullYear()} CyberSentinels Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;