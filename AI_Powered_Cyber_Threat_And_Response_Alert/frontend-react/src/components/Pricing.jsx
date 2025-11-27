// import React from "react";
// import { Check } from "lucide-react";
// import { Link } from "react-router-dom";

// const plans = [
//   {
//     name: "Starter",
//     price: "$0",
//     period: "/mo",
//     desc: "Perfect for small teams and individual developers.",
//     features: ["Real-time Monitoring", "500 MB Log Retention", "Basic Email Alerts", "Community Support"],
//     cta: "Start Free",
//     highlight: false
//   },
//   {
//     name: "Pro",
//     price: "$99",
//     period: "/mo",
//     desc: "Advanced protection for growing businesses.",
//     features: ["AI Threat Detection", "30 Days Log Retention", "SMS & Webhook Alerts", "Priority Support", "Automated Remediation"],
//     cta: "Get Pro",
//     highlight: true
//   },
//   {
//     name: "Enterprise",
//     price: "Custom",
//     period: "",
//     desc: "Full-scale security for large organizations.",
//     features: ["Unlimited Log Retention", "Dedicated Threat Hunter", "Custom AI Models", "SSO & RBAC", "24/7 Phone Support"],
//     cta: "Contact Sales",
//     highlight: false
//   }
// ];

// const Pricing = () => {
//   return (
//     <section id="pricing" className="py-24 bg-slate-950">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
//             Simple, Transparent Pricing
//           </h2>
//           <p className="text-slate-400">
//             Choose the plan that fits your security needs. No hidden fees.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//           {plans.map((plan, index) => (
//             <div 
//               key={index}
//               className={`relative p-8 rounded-2xl border flex flex-col ${
//                 plan.highlight 
//                   ? "bg-slate-900 border-blue-500 shadow-2xl shadow-blue-900/20 scale-105 z-10" 
//                   : "bg-slate-950 border-slate-800 hover:border-slate-700"
//               }`}
//             >
//               {plan.highlight && (
//                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
//                   Most Popular
//                 </div>
//               )}
              
//               <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
//               <div className="mb-4">
//                 <span className="text-4xl font-extrabold text-white">{plan.price}</span>
//                 <span className="text-slate-500 ml-1">{plan.period}</span>
//               </div>
//               <p className="text-slate-400 text-sm mb-8">{plan.desc}</p>

//               <ul className="space-y-4 mb-8 flex-1">
//                 {plan.features.map((feat, idx) => (
//                   <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
//                     <Check className="w-5 h-5 text-green-500 shrink-0" />
//                     <span>{feat}</span>
//                   </li>
//                 ))}
//               </ul>

//               <Link to="/register" className="w-full">
//                 <button className={`w-full py-3 rounded-lg font-bold transition-all ${
//                   plan.highlight 
//                     ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg" 
//                     : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
//                 }`}>
//                   {plan.cta}
//                 </button>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Pricing;