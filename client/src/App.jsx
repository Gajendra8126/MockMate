import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Output from './pages/Output';
import Features from './pages/Features';
import Documentation from './pages/Documentation';
import Blog from './pages/Blog';


function App() {
  // Default is dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle dark/light mode class on html tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen selection:bg-brand-500/30 overflow-x-hidden relative transition-colors duration-300">
      {/* Background ambient light */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-1%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />

      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results/:id" element={<Output />} />
        <Route path="/features" element={<Features />} />
        <Route path="/features/:featureId" element={<Features />} />
           <Route path="/documentation" element={<Documentation />} />
           <Route path="/blog" element={<Blog />} />
       
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;
