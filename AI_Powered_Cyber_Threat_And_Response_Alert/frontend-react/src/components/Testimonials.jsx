import React from "react";
import { Quote } from "lucide-react";

const reviews = [
  {
    quote:
      "This system detected a ransomware attempt that went unnoticed by our traditional firewall. It saved us millions in potential damages.",
    author: "Manish Sharma",
    role: "Lead Security Analyst",
    company: "CyberSecure India",
    photo: "https://i.pravatar.cc/150?img=32",
  },
  {
    quote:
      "The automated incident response helps us prevent breaches faster than ever. It’s like having an extra team of analysts working 24/7.",
    author: "Priya Nair",
    role: "DevSecOps Engineer",
    company: "FinTech Solutions",
    photo: "https://i.pravatar.cc/150?img=12",
  },
  {
    quote:
      "The dashboard provides clean and clear insights for quick decision-making. Setting it up took less than 10 minutes.",
    author: "Arjun Mehta",
    role: "CTO",
    company: "DataSphere Tech",
    photo: "https://i.pravatar.cc/150?img=56",
  },

  // ---------------- EXTRA 3 REVIEWS ----------------
  {
    quote:
      "CyberSentinels reduced our incident response time by nearly 60%. The accuracy of threat classification is outstanding.",
    author: "Sneha Gupta",
    role: "SOC Manager",
    company: "ShieldX Security",
    photo: "https://i.pravatar.cc/150?img=14",
  },
  {
    quote:
      "The AI threat engine identified anomalies we didn’t even know existed. The platform pays for itself instantly.",
    author: "Rohit Verma",
    role: "Cybersecurity Consultant",
    company: "SecureTech Global",
    photo: "https://i.pravatar.cc/150?img=48",
  },
  {
    quote:
      "We integrated CyberSentinels with our cloud setup effortlessly. The analytics dashboard is the best I’ve used.",
    author: "Aditi Rao",
    role: "Cloud Security Lead",
    company: "NextGen Cloud",
    photo: "https://i.pravatar.cc/150?img=22",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-900 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by Security Experts
          </h2>
          <p className="text-slate-400">See what professionals are saying about CyberSentinels.</p>
        </div>

        {/* Horizontal Scroll Slider */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="min-w-[350px] max-w-[350px] snap-center p-8 bg-slate-950 rounded-2xl border border-slate-800 relative hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <Quote size={18} fill="currentColor" />
              </div>

              <p className="text-slate-300 italic mb-8 leading-relaxed">
                "{review.quote}"
              </p>

              <div className="flex items-center gap-4 border-t border-slate-800 pt-6">
                <img
                  src={review.photo}
                  alt={review.author}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700 shadow-md"
                />

                <div>
                  <h4 className="text-white font-bold text-sm">{review.author}</h4>
                  <div className="text-xs text-slate-500">
                    {review.role} at{" "}
                    <span className="text-blue-400">{review.company}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
