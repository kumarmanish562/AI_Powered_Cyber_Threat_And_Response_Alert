import React from "react";
import { Target, Users, Award } from "lucide-react";

const stats = [
  { label: "Threats Blocked", value: "10M+", icon: Target },
  { label: "Security Experts", value: "50+", icon: Users },
  { label: "Industry Awards", value: "12", icon: Award },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-[#0b1120] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <h2 className="text-blue-500 font-bold uppercase tracking-wide text-sm mb-2">About Us</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
              Defending the Digital World with Artificial Intelligence
            </h3>
            <p className="text-slate-400 text-lg mb-6 leading-relaxed">
              Founded by a team of ex-military cybersecurity experts and AI researchers, CyberSentinels was built on a single premise: <strong>Traditional firewalls are no longer enough.</strong>
            </p>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              We combine state-of-the-art machine learning with deep packet inspection to predict attacks before they happen, ensuring your infrastructure remains resilient against the threats of tomorrow.
            </p>
            
            <button className="text-blue-400 font-semibold hover:text-blue-300 flex items-center gap-2 group transition-colors">
              Meet the Team <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className={`p-6 rounded-xl border border-slate-800 bg-slate-900/50 ${index === 2 ? "sm:col-span-2" : ""}`}>
                <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="text-3xl font-bold text-white mb-1">{stat.value}</h4>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;