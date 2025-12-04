import React, { useEffect, useRef } from "react";
import { Check, Zap, Shield, Server, X, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const plans = [
    {
        name: "Starter",
        price: "$0",
        period: "/mo",
        desc: "Perfect for small teams and individual developers.",
        features: ["Real-time Monitoring", "500 MB Log Retention", "Basic Email Alerts", "Community Support"],
        cta: "Start Free",
        icon: Zap,
        highlight: false,
        color: "slate"
    },
    {
        name: "Pro",
        price: "$99",
        period: "/mo",
        desc: "Advanced protection for growing businesses.",
        features: ["AI Threat Detection", "30 Days Log Retention", "SMS & Webhook Alerts", "Priority Support", "Automated Remediation"],
        cta: "Get Pro",
        icon: Shield,
        highlight: true,
        color: "blue"
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        desc: "Full-scale security for large organizations.",
        features: ["Unlimited Log Retention", "Dedicated Threat Hunter", "Custom AI Models", "SSO & RBAC", "24/7 Phone Support"],
        cta: "Contact Sales",
        icon: Server,
        highlight: false,
        color: "purple"
    }
];

const comparisonData = [
    { feature: "Log Retention", starter: "500 MB", pro: "30 Days", enterprise: "Unlimited" },
    { feature: "Threat Detection", starter: "Signature-based", pro: "AI-Powered", enterprise: "Custom AI Models" },
    { feature: "Alert Channels", starter: "Email", pro: "Email, SMS, Webhook", enterprise: "All + SIEM Integration" },
    { feature: "Support SLA", starter: "Community", pro: "24 Hours", enterprise: "1 Hour" },
    { feature: "SSO / SAML", starter: false, pro: false, enterprise: true },
    { feature: "Dedicated Account Manager", starter: false, pro: false, enterprise: true },
];

const Pricing = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".pricing-card", {
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 85%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)"
            });

            gsap.from(".comparison-row", {
                scrollTrigger: {
                    trigger: ".comparison-table",
                    start: "top 80%",
                },
                opacity: 0,
                x: -20,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="pricing" ref={sectionRef} className="py-32 bg-[#0b1120] relative overflow-hidden">

            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-40 right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Choose the plan that fits your security needs. No hidden fees.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center mb-32">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`pricing-card relative p-8 rounded-2xl border flex flex-col transition-all duration-300 ${plan.highlight
                                ? "bg-slate-900 border-blue-500 shadow-2xl shadow-blue-900/20 scale-105 z-10"
                                : "bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.highlight ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                                    }`}>
                                    <plan.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-slate-400 text-sm h-10">{plan.desc}</p>
                            </div>

                            <div className="mb-8">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-slate-500 ml-1 font-medium">{plan.period}</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                                        <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlight ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-500"}`}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/register" className="w-full">
                                <button className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${plan.highlight
                                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40"
                                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600"
                                    }`}>
                                    {plan.cta}
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Feature Comparison Table */}
                <div className="comparison-table max-w-5xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-8 text-center">Compare Features</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="py-4 px-6 text-slate-400 font-medium w-1/4">Feature</th>
                                    <th className="py-4 px-6 text-white font-bold w-1/4 text-center">Starter</th>
                                    <th className="py-4 px-6 text-blue-400 font-bold w-1/4 text-center">Pro</th>
                                    <th className="py-4 px-6 text-purple-400 font-bold w-1/4 text-center">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonData.map((row, index) => (
                                    <tr key={index} className="comparison-row border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors">
                                        <td className="py-4 px-6 text-slate-300 font-medium flex items-center gap-2">
                                            {row.feature}
                                            <HelpCircle size={14} className="text-slate-600 cursor-help" />
                                        </td>
                                        <td className="py-4 px-6 text-slate-400 text-center">
                                            {typeof row.starter === 'boolean' ? (
                                                row.starter ? <Check size={20} className="mx-auto text-emerald-500" /> : <X size={20} className="mx-auto text-slate-600" />
                                            ) : row.starter}
                                        </td>
                                        <td className="py-4 px-6 text-white text-center font-medium">
                                            {typeof row.pro === 'boolean' ? (
                                                row.pro ? <Check size={20} className="mx-auto text-blue-500" /> : <X size={20} className="mx-auto text-slate-600" />
                                            ) : row.pro}
                                        </td>
                                        <td className="py-4 px-6 text-white text-center font-medium">
                                            {typeof row.enterprise === 'boolean' ? (
                                                row.enterprise ? <Check size={20} className="mx-auto text-purple-500" /> : <X size={20} className="mx-auto text-slate-600" />
                                            ) : row.enterprise}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Pricing;