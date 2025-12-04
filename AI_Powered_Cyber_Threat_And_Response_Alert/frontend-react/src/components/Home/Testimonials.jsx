import React, { useEffect, useRef, useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star, ShieldCheck, Building2, User, Activity } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- DATA ---
const testimonials = [
  {
    id: 1,
    quote: "We caught a zero-day exploit 4 milliseconds after it hit our perimeter. The ROI on this platform was instantaneous.",
    author: "Elena Rodriguez",
    role: "CISO",
    company: "FinTech Global",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1469&auto=format&fit=crop",
    stats: { label: "Threats Blocked", value: "14k+", color: "text-cyan-400" },
    theme: "cyan"
  },
  {
    id: 2,
    quote: "The visual workflow builder allowed us to automate 90% of our Tier-1 incident responses. My team finally sleeps at night.",
    author: "Marcus Chen",
    role: "VP of Engineering",
    company: "CloudScale Inc.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop",
    stats: { label: "Response Time", value: "-85%", color: "text-purple-400" },
    theme: "purple"
  },
  {
    id: 3,
    quote: "Forensic-grade logging that actually makes sense. Passing our SOC2 audit was effortless thanks to the immutable audit trails.",
    author: "Sarah Jenkins",
    role: "Head of Compliance",
    company: "HealthVault",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    stats: { label: "Compliance Score", value: "100%", color: "text-emerald-400" },
    theme: "emerald"
  }
];

const Testimonials = () => {
  const [active, setActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const quoteRef = useRef(null);
  const statsRef = useRef(null);

  // --- GSAP ANIMATION HANDLER ---
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onStart: () => setIsAnimating(true),
        onComplete: () => setIsAnimating(false)
      });

      // 1. Image Transition (Zoom & Fade)
      tl.fromTo(imageRef.current,
        { scale: 1.1, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
        0
      );

      // 2. Text Reveal (Staggered Slide Up)
      const textElements = textRef.current.querySelectorAll(".anim-text");
      tl.fromTo(textElements,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        0.1
      );

      // 3. Quote Icon Pop
      tl.fromTo(quoteRef.current,
        { scale: 0, rotation: -45 },
        { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" },
        0.2
      );

      // 4. Stats Counter Slide
      tl.fromTo(statsRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        0.3
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [active]);

  const handleNext = () => {
    if (isAnimating) return;
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentData = testimonials[active];

  return (
    <section ref={sectionRef} className="relative py-32 bg-[#020617] overflow-hidden min-h-[900px] flex flex-col justify-center">

      {/* --- BACKGROUND (Matches Hero/Threats) --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Spotlights */}
        <div className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-${currentData.theme}-500/10 blur-[120px] rounded-full transition-colors duration-1000`}></div>
        <div className="absolute inset-0 bg-[#020617]/40"></div>
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">

        {/* --- Header --- */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-widest mb-4">
            <Star className="text-yellow-500 fill-yellow-500" size={12} />
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Trusted by the <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">World's Safest Companies</span>
          </h2>
        </div>

        {/* --- Main Card --- */}
        <div className="relative w-full max-w-6xl mx-auto aspect-[16/16] lg:aspect-[21/9] bg-[#09090b] rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col lg:flex-row">

          {/* Left: Image (40%) */}
          <div className="lg:w-2/5 relative overflow-hidden bg-slate-900 border-b lg:border-b-0 lg:border-r border-white/10 h-64 lg:h-auto group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10 opacity-60"></div>
            <img
              ref={imageRef}
              src={currentData.image}
              alt={currentData.author}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
            />

            {/* Floating Badge on Image */}
            <div ref={statsRef} className="absolute bottom-6 left-6 z-20 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <Activity size={12} /> {currentData.stats.label}
              </div>
              <div className={`text-2xl font-bold ${currentData.stats.color}`}>
                {currentData.stats.value}
              </div>
            </div>
          </div>

          {/* Right: Content (60%) */}
          <div className="lg:w-3/5 p-8 md:p-16 flex flex-col justify-center relative">

            {/* Background Logo Watermark */}
            <div className="absolute right-0 top-0 p-10 opacity-[0.03] pointer-events-none">
              <ShieldCheck size={300} />
            </div>

            <div ref={textRef} className="relative z-10">

              {/* Quote Icon */}
              <div ref={quoteRef} className={`w-12 h-12 rounded-full bg-${currentData.theme}-500/10 border border-${currentData.theme}-500/20 flex items-center justify-center mb-8`}>
                <Quote size={20} className={`text-${currentData.theme}-400`} />
              </div>

              {/* The Quote */}
              <h3 className="anim-text text-2xl md:text-4xl font-bold text-white leading-tight mb-8">
                "{currentData.quote}"
              </h3>

              {/* Author Details */}
              <div className="anim-text flex items-center gap-4">
                <div className={`w-1 h-12 bg-gradient-to-b from-${currentData.theme}-500 to-transparent rounded-full`}></div>
                <div>
                  <div className="text-xl font-bold text-white">{currentData.author}</div>
                  <div className="text-slate-400 flex items-center gap-2 text-sm mt-1">
                    <User size={14} /> {currentData.role}
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    <Building2 size={14} /> {currentData.company}
                  </div>
                </div>
              </div>

            </div>

            {/* Navigation Controls (Bottom Right) */}
            <div className="absolute bottom-8 right-8 flex gap-3 z-20">
              <button
                onClick={handlePrev}
                className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group"
                disabled={isAnimating}
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group"
                disabled={isAnimating}
              >
                <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </div>

        {/* --- Progress Indicators --- */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${active === idx ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`}
            ></div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;