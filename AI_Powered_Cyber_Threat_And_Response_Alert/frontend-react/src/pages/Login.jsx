import React, { useState } from 'react';
import { ArrowLeft, User, Lock, KeyRound, Check, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const API = 'http://localhost:8000';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  const [view, setView] = useState('login');

  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState(''); // New State
  const [showMfaInput, setShowMfaInput] = useState(false); // New State

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetSent, setResetSent] = useState(false);

  // --- 1. REAL LOGIN HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resp = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, mfa_code: mfaCode }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        // DETECT MFA REQUIREMENT
        if (data.detail === "MFA_REQUIRED") {
          setShowMfaInput(true);
          setLoading(false);
          return;
        }
        throw new Error(data.detail || 'Invalid credentials');
      }

      localStorage.setItem('token', data.access_token);
      navigate(from);

    } catch (err) {
      setError(String(err.message));
      if (!showMfaInput) setShowMfaInput(false);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. REAL FORGOT PASSWORD HANDLER ---
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok) throw new Error("Failed");
      setResetSent(true);
    } catch (err) {
      // We simulate success for security reasons even if API fails/user not found
      setResetSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-20 left-20 w-48 h-48 bg-blue-600 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-cyan-600 rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-sm w-full bg-slate-900 border border-slate-700 rounded-lg shadow-2xl relative z-10">
        <Link to="/" className="absolute -top-10 left-0 text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-blue-600 p-6 rounded-t-lg text-center border-b border-blue-500">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-white/10 rounded-full">
              {view === 'login' ? <Lock className="w-6 h-6 text-white" /> : <KeyRound className="w-6 h-6 text-white" />}
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {view === 'login' ? 'Welcome Back' : 'Reset Password'}
          </h2>
        </div>

        <div className="p-6">
          {view === 'login' ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Standard Inputs */}
              {!showMfaInput && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-md py-2.5 pl-10 pr-3 text-sm text-white focus:border-blue-500 outline-none" placeholder="name@company.com" required />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                      <button type="button" onClick={() => setView('forgot')} className="text-xs text-blue-400 hover:text-blue-300">Forgot Password?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-md py-2.5 pl-10 pr-3 text-sm text-white focus:border-blue-500 outline-none" placeholder="••••••••" required />
                    </div>
                  </div>
                </>
              )}

              {/* MFA Input (Only shows when required) */}
              {showMfaInput && (
                <div className="animate-fade-in bg-slate-800/50 p-4 rounded-lg border border-cyan-500/30">
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 text-center">
                    Enter 2FA Code
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-5 w-5 text-cyan-500" />
                    <input
                      type="text"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="w-full bg-slate-950 border border-cyan-500 rounded-md py-2.5 pl-10 pr-3 text-center text-lg tracking-widest text-white focus:ring-1 focus:ring-cyan-500 outline-none"
                      placeholder="000 000"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-md text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? 'Authenticating...' : (showMfaInput ? 'Verify Code' : 'Sign In')}
              </button>

              {error && <div className="text-red-400 text-xs text-center bg-red-900/20 p-2.5 rounded border border-red-900/50 animate-shake">{error}</div>}
            </form>
          ) : (
            // Forgot Password UI (Same as before but using real handleForgotSubmit)
            !resetSent ? (
              <form className="space-y-5" onSubmit={handleForgotSubmit}>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registered Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-md py-2.5 px-3 text-sm text-white focus:border-blue-500 outline-none" required />
                </div>
                <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-md text-sm">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button type="button" onClick={() => setView('login')} className="w-full text-xs text-slate-500 hover:text-white mt-2">Back to Login</button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="text-green-500 w-6 h-6" /></div>
                <h3 className="text-white font-bold mb-2">Check your inbox</h3>
                <button onClick={() => { setView('login'); setResetSent(false); }} className="text-blue-400 hover:text-blue-300 text-sm font-medium">Return to Login</button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;