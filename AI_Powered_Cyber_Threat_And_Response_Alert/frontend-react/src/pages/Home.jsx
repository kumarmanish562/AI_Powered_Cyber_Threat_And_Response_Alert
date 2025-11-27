import React from 'react';

// Import components
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ThreatsSection from '../components/ThreatsSection'; // New
// import Pricing from '../components/Pricing'; // New
import About from '../components/About'; // New
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ThreatsSection /> {/* Section ID: #threats */}
        {/* <Pricing />        Section ID: #pricing */}
        <Testimonials />
        <About />          {/* Section ID: #about */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;