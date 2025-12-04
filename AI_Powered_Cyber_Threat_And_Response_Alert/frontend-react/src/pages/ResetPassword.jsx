import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Lock, KeyRound, CheckCircle2, Shield, ChevronRight, AlertCircle, ScanEye, Terminal } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/Home/Navbar';
import Footer from '../components/Home/Footer';
import { resetPassword } from '../services/api';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const imageRef = useRef(null);

    // Get email from navigation state if available
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // --- GSAP Animations ---
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(imageRef.current, {
                x: -100,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            });

            gsap.from(formRef.current, {
                x: 100,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.2
            });

            gsap.from(".anim-input", {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            await resetPassword({
                email,
                otp,
                new_password: newPassword
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to reset password. Please check your OTP.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col font-sans text-slate-300">
                <Navbar />
                <div className="flex-grow flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-[#020617]"></div>
                    <div className="bg-[#0f172a] border border-green-500/30 p-12 rounded-3xl text-center max-w-md w-full shadow-2xl relative z-10">
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                            <CheckCircle2 className="text-green-500 w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Password Reset!</h2>
                        <p className="text-slate-400">Your password has been updated successfully. Redirecting to login...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-[#020617] flex flex-col font-sans text-slate-300 selection:bg-blue-500/30 overflow-hidden">
            <Navbar />

            <div className="flex-grow flex relative pt-20">
                {/* --- Background Elements --- */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-900/10 blur-[120px] rounded-full"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
                </div>

                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 relative z-10 min-h-[calc(100vh-80px)]">

                    {/* --- LEFT COLUMN: Visuals --- */}
                    <div ref={imageRef} className="hidden lg:flex flex-col justify-center p-12 relative">
                        <div className="absolute inset-0 bg-indigo-600/5 rounded-3xl border border-white/5 backdrop-blur-sm m-6 -z-10"></div>

                        <div className="relative z-10 max-w-lg">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8 uppercase tracking-wider">
                                <Shield size={12} />
                                Secure Recovery
                            </div>

                            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                                Regain Access <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Securely.</span>
                            </h1>

                            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                                Reset your credentials to restore access to the command terminal. Ensure your new password meets security standards.
                            </p>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: The Form --- */}
                    <div className="flex items-center justify-center p-6 lg:p-12">
                        <div ref={formRef} className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                            {/* Top Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                            {/* Header */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-1">Reset Password</h2>
                                <p className="text-slate-400 text-sm">Enter the OTP sent to your email and your new password.</p>
                            </div>

                            <form className="space-y-5" onSubmit={handleSubmit}>

                                {/* Email (Read Only if passed, else editable) */}
                                <div className="anim-input group">
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block group-focus-within:text-blue-400">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                                        placeholder="operator@system.io"
                                        required
                                    />
                                </div>

                                {/* OTP Input */}
                                <div className="anim-input group">
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block group-focus-within:text-blue-400">OTP Code</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 tracking-widest font-mono"
                                            placeholder="000000"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="anim-input group">
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block group-focus-within:text-blue-400">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="anim-input group">
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block group-focus-within:text-blue-400">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Resetting...</span>
                                    ) : (
                                        <>
                                            Reset Password
                                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-xs animate-shake">
                                    <Shield size={14} className="shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="mt-6 text-center pt-6 border-t border-white/5">
                                <Link to="/login" className="text-slate-500 hover:text-white text-xs flex items-center justify-center gap-1 group transition-colors">
                                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ResetPassword;
