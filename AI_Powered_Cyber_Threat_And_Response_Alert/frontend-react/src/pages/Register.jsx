import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, User, Mail, Lock, UserPlus, Key, CheckCircle, RefreshCw, Timer, Shield, ChevronRight, Fingerprint, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/Home/Navbar';
import Footer from '../components/Home/Footer';

const API = 'http://localhost:8000';

const Register = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const imageRef = useRef(null);

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

  // Initial Animation
  useEffect(() => {
    const ctx = gsap.context(() => {

      // 1. Image/Side Panel Entrance
      gsap.from(imageRef.current, {
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      });

      // 2. Form Container Entrance
      gsap.from(formRef.current, {
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2
      });

      // 3. Staggered Inputs
      gsap.from(".input-group", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)",
        delay: 0.6
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Step Transition Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".step-content",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }, formRef);
    return () => ctx.revert();
  }, [step]);

  // Logic Handlers
  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError(null);

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
      const response = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Frontend fields map to backend schema
          email: formData.email,
          password: formData.password,
          full_name: `${formData.firstName} ${formData.lastName}`
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Registration failed');
      }

      setStep('verify');
      setTimer(60);
      setCanResend(false);

    } catch (err) {
      setError(err.message || "Connection failed. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setTimer(60);
    setCanResend(false);
    // Add resend API logic here
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Verification failed');
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.message || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  // Success View Overlay
  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#020617] flex flex-col font-sans text-slate-700 dark:text-slate-300 transition-colors duration-300">
        <Navbar />
        <div className="flex-grow flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-green-50/50 dark:bg-gradient-to-br dark:from-green-900/20 dark:to-[#020617]"></div>
          <div className="bg-white dark:bg-[#0f172a] border border-green-100 dark:border-green-500/30 p-12 rounded-3xl text-center max-w-md w-full shadow-2xl relative z-10 transition-colors">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
              <CheckCircle className="text-green-600 dark:text-green-500 w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Access Granted</h2>
            <p className="text-slate-500 dark:text-slate-400">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col font-sans text-slate-700 dark:text-slate-300 selection:bg-blue-500/30 overflow-hidden transition-colors duration-300">
      <Navbar />

      <div className="flex-grow flex relative pt-20">

        {/* --- Background Elements --- */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-900/10 blur-[120px] rounded-full"></div>
          <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 relative z-10 min-h-[calc(100vh-80px)]">

          {/* --- LEFT COLUMN: Visuals --- */}
          <div ref={imageRef} className="hidden lg:flex flex-col justify-center p-12 relative">
            <div className="absolute inset-0 bg-blue-600/5 rounded-3xl border border-white/5 backdrop-blur-sm m-6 -z-10"></div>

            <div className="relative z-10 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8 uppercase tracking-wider">
                <ShieldCheck size={12} />
                Secure Access
              </div>

              <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Join the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Cyber.</span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                Create your account to access real-time threat monitoring, automated security, and advanced tools.
              </p>

              {/* Decorative Card */}
              <div className="bg-white dark:bg-[#09090b] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl max-w-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <Fingerprint className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-bold text-sm">Identity Verification</div>
                    <div className="text-xs text-slate-500">Security Status: High</div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Background Image Layer */}
            <div className="absolute inset-0 -z-20 m-6 rounded-3xl overflow-hidden opacity-40">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="Background" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent"></div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: The Form --- */}
          <div className="flex items-center justify-center p-6 lg:p-12">

            <div ref={formRef} className="w-full max-w-md bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">

              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {step === 'register' ? 'Create Account' : 'Verify Email'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {step === 'register' ? 'Sign up to get started.' : `We sent a code to ${formData.email}`}
                </p>
              </div>

              {/* Dynamic Content */}
              <div className="step-content">
                {step === 'register' ? (
                  <form className="space-y-5" onSubmit={handleRegister}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="input-group group">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase mb-1.5 block group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400">First Name</label>
                        <input name="firstName" onChange={handleChange} type="text" className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="John" required />
                      </div>
                      <div className="input-group group">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase mb-1.5 block group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400">Last Name</label>
                        <input name="lastName" onChange={handleChange} type="text" className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="Doe" required />
                      </div>
                    </div>

                    <div className="input-group group">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase mb-1.5 block group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                        <input name="email" onChange={handleChange} type="email" className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="name@company.com" required />
                      </div>
                    </div>

                    <div className="input-group group">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase mb-1.5 block group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                        <input name="password" onChange={handleChange} type="password" className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="••••••••" required />
                      </div>
                    </div>

                    <div className="input-group group">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase mb-1.5 block group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400">Confirm Password</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                        <input name="confirm" onChange={handleChange} type="password" className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="••••••••" required />
                      </div>
                    </div>

                    <button
                      disabled={loading}
                      className="
    w-full bg-blue-600 hover:bg-blue-500 
    text-white font-bold py-3.5 rounded-xl 
    transition-all shadow-lg shadow-blue-600/20 
    hover:shadow-blue-600/40 flex items-center 
    justify-center gap-2 mt-4 
    disabled:opacity-50 disabled:cursor-not-allowed group
  "
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        <>Create Account <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>

                  </form>
                ) : (
                  // --- VERIFICATION FORM ---
                  <form className="space-y-6" onSubmit={handleVerify}>
                    <div className="input-group text-center py-6">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Verification Code</label>
                      <input
                        name="otp"
                        onChange={handleChange}
                        type="text"
                        maxLength="6"
                        className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-2xl py-5 text-center text-4xl tracking-[0.5em] font-mono text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-800"
                        placeholder="000000"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <button type="button" onClick={() => setStep('register')} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                        ← Wrong email?
                      </button>

                      {canResend ? (
                        <button type="button" onClick={handleResendOtp} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-1.5 font-bold transition-colors">
                          <RefreshCw size={12} /> Resend Code
                        </button>
                      ) : (
                        <span className="text-slate-600 flex items-center gap-1.5 font-mono cursor-wait">
                          <Timer size={12} /> 00:{timer < 10 ? `0${timer}` : timer}
                        </span>
                      )}
                    </div>

                    <button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 flex items-center justify-center gap-2 disabled:opacity-50">
                      {loading ? 'Checking...' : <><ShieldCheck size={18} /> Verify Code</>}
                    </button>
                  </form>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-xs animate-shake">
                  <Shield size={14} className="shrink-0" />
                  {error}
                </div>
              )}

              {/* Footer Login Link */}
              {step === 'register' && (
                <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-white/5">
                  <p className="text-slate-500 text-xs">
                    Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold ml-1 transition-colors">Log in</Link>
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;