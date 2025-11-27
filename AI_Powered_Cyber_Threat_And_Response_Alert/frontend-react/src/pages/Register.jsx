import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Lock, UserPlus, Key, CheckCircle, RefreshCw, Timer } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API = 'http://localhost:8000';

const Register = () => {
  const navigate = useNavigate();
  
  // State for steps: 'register' | 'verify'
  const [step, setStep] = useState('register');
  
  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    otp: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Timer State for OTP Resend
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Timer Logic
  useEffect(() => {
    let interval;
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Step 1: Submit Registration (Also used for Resend)
  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    // Validation (Only needed for initial register, but harmless to re-check)
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        full_name: `${formData.firstName} ${formData.lastName}`.trim()
      };

      const resp = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || 'Signup failed.');

      // Move to Verify Step & Reset Timer
      setStep('verify');
      setTimer(60);
      setCanResend(false);

    } catch (err) {
      setError(String(err.message));
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Wrapper
  const handleResendOtp = () => {
    handleRegister(); 
  };

  // Step 2: Submit OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resp = await fetch(`${API}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || 'Verification failed.');

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(String(err.message));
    } finally {
      setLoading(false);
    }
  };

  // Success View
  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-green-500/30 p-8 rounded-xl text-center max-w-sm w-full shadow-2xl animate-fade-in">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-500 w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Account Verified!</h2>
          <p className="text-slate-400 text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden py-4">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-10 right-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-10 left-10 w-64 h-64 bg-cyan-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-sm w-full bg-slate-900 border border-slate-700 rounded-lg shadow-2xl relative z-10">
        <Link to="/" className="absolute -top-8 left-0 text-slate-400 hover:text-white flex items-center gap-2 text-xs transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Home
        </Link>

        <div className="bg-blue-600 p-4 rounded-t-lg text-center border-b border-blue-500">
           <div className="flex justify-center mb-1">
             <UserPlus className="w-6 h-6 text-white opacity-90" />
           </div>
           <h2 className="text-lg font-bold text-white tracking-wide">
             {step === 'register' ? 'Create Account' : 'Verify Email'}
           </h2>
           <p className="text-blue-100 text-xs mt-1">
             {step === 'register' ? 'Join the secure network' : `Code sent to ${formData.email}`}
           </p>
        </div>

        <div className="p-6">
            {step === 'register' ? (
              // --- REGISTRATION FORM ---
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">First Name</label>
                      <input name="firstName" onChange={handleChange} type="text" className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 px-3 text-sm text-white focus:border-blue-500 outline-none" placeholder="John" required />
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Last Name</label>
                      <input name="lastName" onChange={handleChange} type="text" className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 px-3 text-sm text-white focus:border-blue-500 outline-none" placeholder="Doe" required />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input name="email" onChange={handleChange} type="email" className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:border-blue-500 outline-none" placeholder="name@company.com" required />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input name="password" onChange={handleChange} type="password" className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:border-blue-500 outline-none" placeholder="••••••••" required />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input name="confirm" onChange={handleChange} type="password" className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:border-blue-500 outline-none" placeholder="••••••••" required />
                  </div>
                </div>

                <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 mt-4 rounded-md text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? 'Processing...' : 'Next Step'}
                </button>
              </form>
            ) : (
              // --- OTP VERIFICATION FORM ---
              <form className="space-y-6" onSubmit={handleVerify}>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">Enter 6-Digit Code</label>
                  <input 
                    name="otp" 
                    onChange={handleChange} 
                    type="text" 
                    maxLength="6"
                    className="w-full bg-slate-950 border border-slate-700 rounded-md py-3 text-center text-2xl tracking-[0.5em] font-mono text-white focus:border-blue-500 outline-none" 
                    placeholder="000000" 
                    required 
                  />
                  <div className="flex justify-between items-center mt-3 px-1">
                    <p className="text-xs text-slate-500">
                      Check your email inbox.
                    </p>
                    
                    {/* Resend Logic */}
                    {canResend ? (
                       <button 
                         type="button" 
                         onClick={handleResendOtp}
                         disabled={loading}
                         className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                       >
                         {loading ? <span className="animate-spin">↻</span> : <RefreshCw size={12}/>} Resend OTP
                       </button>
                    ) : (
                       <span className="text-xs text-slate-600 flex items-center gap-1 cursor-not-allowed">
                         <Timer size={12}/> Resend in {timer}s
                       </span>
                    )}
                  </div>
                </div>

                <button disabled={loading} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-md text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? 'Verifying...' : <><CheckCircle size={16}/> Verify Account</>}
                </button>
                
                <button type="button" onClick={() => setStep('register')} className="w-full text-xs text-slate-500 hover:text-white mt-2">
                  Wrong email? Go back
                </button>
              </form>
            )}

            {error && (
              <div className="text-red-400 text-xs text-center mt-3 bg-red-900/20 p-2 rounded border border-red-900/50 animate-pulse">
                {error}
              </div>
            )}

            {step === 'register' && (
              <div className="mt-4 text-center text-xs text-slate-500">
                Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium ml-1">Login here</Link>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Register;