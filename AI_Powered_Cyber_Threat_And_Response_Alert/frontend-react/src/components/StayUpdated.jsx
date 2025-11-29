import React from "react";
import { ArrowLeft, CheckCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const StayUpdated = () => {
    return (
        <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
            {/* Header */}
            <nav className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl shadow-blue-900/20">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-4">You're Subscribed!</h1>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Thank you for subscribing to our security alerts. You will now receive the latest threat intelligence and updates directly to your inbox.
                    </p>

                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex items-center gap-3 mb-8 text-left">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Mail className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">Check your email</p>
                            <p className="text-slate-500 text-xs">We've sent a confirmation link.</p>
                        </div>
                    </div>

                    <Link
                        to="/"
                        className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default StayUpdated;
