import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Target, Users, Award, ArrowRight, Shield, Globe, Network, Cpu } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { id: 1, label: "Threats Blocked", value: 10, suffix: "M+", icon: Target, color: "blue" },
  { id: 2, label: "Security Experts", value: 50, suffix: "+", icon: Users, color: "cyan" },
  { id: 3, label: "Industry Awards", value: 12, suffix: "", icon: Award, color: "purple" },
  { id: 4, label: "Global Nodes", value: 240, suffix: "", icon: Globe, color: "emerald" },
];

const About = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  // Using refs for counters to avoid document.getElementById issues
  const counterRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // 1. Reveal Animations (Text & UI)
      gsap.from(".about-reveal", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });

      // 2. Stats Counter Animation
      stats.forEach((stat, index) => {
        const target = counterRefs.current[index];
        if (!target) return;

        ScrollTrigger.create({
          trigger: ".stats-grid",
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(target, {
              innerHTML: stat.value,
              duration: 2.5,
              snap: { innerHTML: 1 },
              ease: "power2.out"
            });
          }
        });
      });

      // 3. Globe Continuous Rotation
      gsap.to(".holo-globe", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "linear"
      });

      // 4. 3D Tilt Effect on Mouse Move
      const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25;
        const y = (e.clientY - top - height / 2) / 25;

        gsap.to(cardRef.current, {
          rotationY: x,
          rotationX: -y,
          duration: 0.5,
          ease: "power2.out"
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-32 bg-slate-50 dark:bg-[#020617] relative overflow-hidden transition-colors duration-300">

      {/* --- BACKGROUND (Unified Grid) --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glow Spot */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-900/10 blur-[120px] rounded-full"></div>
        {/* Sharp Grid with Radial Mask */}
        <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* --- LEFT COLUMN: Typography --- */}
          <div className="order-2 lg:order-1">

            {/* Badge */}
            <div className="about-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold mb-8 uppercase tracking-wider">
              <Shield size={12} className="fill-current" />
              Our Mission
            </div>

            {/* Headline */}
            <h2 className="about-reveal text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
              Defending the Future with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                Intelligent Code.
              </span>
            </h2>

            {/* Description */}
            <div className="about-reveal space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
              <p>
                ThreatWatch AI AI began as a research project to solve a single problem: <strong className="text-slate-800 dark:text-slate-200">Static firewalls cannot stop dynamic threats.</strong>
              </p>
              <p>
                Today, we are a global network of security engineers, data scientists, and ethical hackers building the first autonomous defense layer for the modern web. We don't just log attacks; we predict and neutralize them.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="about-reveal stats-grid grid grid-cols-2 gap-6 pt-8 border-t border-slate-200 dark:border-white/10">
              {stats.map((stat, index) => (
                <div key={stat.id} className="flex flex-col">
                  <div className={`flex items-center gap-2 text-${stat.color}-400 mb-2`}>
                    <stat.icon size={18} />
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-500">{stat.label}</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white flex items-baseline">
                    <span ref={el => counterRefs.current[index] = el}>0</span>
                    <span>{stat.suffix}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="about-reveal mt-12">
              <Link to="/meet-team">
                <button className="group flex items-center gap-3 text-slate-900 dark:text-white font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all">
                    <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <span>Read Our Manifesto</span>
                </button>
              </Link>
            </div>

          </div>

          {/* --- RIGHT COLUMN: Visual (3D Card) --- */}
          <div className="order-1 lg:order-2 perspective-1000 flex justify-center">

            <div
              ref={cardRef}
              className="about-reveal relative w-full max-w-md aspect-[3/4] bg-[#09090b] rounded-3xl border border-white/10 shadow-2xl overflow-hidden transform-style-3d"
              style={{ boxShadow: "0 0 50px -10px rgba(56, 189, 248, 0.1)" }}
            >

              {/* Image Background */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1585900463446-6feaef274557?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y3liZXIlMjBzZWN1aXR5JTIwYWJvdXR8ZW58MHx8MHx8fDA%3D"
                  alt="Data Center"
                  className="w-full h-full object-cover brightness-100 hover:brightness-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-transparent"></div>
              </div>

              {/* Holographic Overlay (Globe) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">

                <div className="relative w-48 h-48 mb-8">
                  {/* Rotating Rings */}
                  <div className="holo-globe absolute inset-0 border border-blue-500/30 rounded-full border-dashed"></div>
                  <div className="holo-globe absolute inset-4 border border-cyan-500/30 rounded-full border-dotted" style={{ animationDirection: 'reverse', animationDuration: '15s' }}></div>

                  {/* Center Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full backdrop-blur-md border border-blue-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                      <Network size={40} className="text-blue-400" />
                    </div>
                  </div>

                  {/* Floating Particles (CSS dots) */}
                  <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                  <div className="absolute bottom-10 right-0 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]"></div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Global Surveillance</h3>
                <p className="text-sm text-slate-400 mb-6">Real-time threat monitoring across 240+ nodes worldwide.</p>

                {/* Live Status Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">System Online</span>
                </div>

              </div>

              {/* Code Snippet Decoration */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-black/80 backdrop-blur-md border-t border-white/10 font-mono text-[10px] text-slate-500 overflow-hidden">
                <div className="flex gap-2 opacity-50">
                  <span className="text-blue-500">const</span> initDefense = <span className="text-yellow-500">async</span> () ={'>'} {'{'}
                </div>
                <div className="pl-4 flex gap-2 opacity-50">
                  <span className="text-purple-500">await</span> neuralNet.loadModel(<span className="text-green-400">'v2.4'</span>);
                </div>
                <div className="pl-4 flex gap-2 opacity-50">
                  <span className="text-blue-500">return</span> <span className="text-cyan-400">true</span>;
                </div>
                <div className="opacity-50">{'}'}</div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default About;