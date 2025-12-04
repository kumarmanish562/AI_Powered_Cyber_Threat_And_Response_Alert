import React from 'react';

// Import components
import Navbar from '../components/Home/Navbar';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import ThreatsSection from '../components/Home/ThreatsSection'; // New
// import Pricing from '../components/Home/Pricing'; // New
import About from '../components/Home/About'; // New
import Testimonials from '../components/Home/Testimonials';
import Footer from '../components/Home/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ThreatsSection /> {/* Section ID: #threats */}
        {/* <Pricing /> */}
        <Testimonials />
        <About />          {/* Section ID: #about */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;