import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { File, X, Sparkles, ChevronRight } from 'lucide-react';

const Home = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    // In a real app, we'd upload files and get an ID. Here we mock it:
    navigate('/results/mock-data-123');
  };

  return (
    <main className="max-w-6xl mx-auto px-6 pt-28 pb-16 relative z-10 transition-colors duration-300">
      <div className="text-center mb-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 dark:text-brand-300 text-sm font-medium border border-brand-500/20">
         <span class="w-2 h-2 rounded-full bg-pink-500"></span>
          <span>Mockmate Engine v2.0 Live</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          Generate Mock Data <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-500 dark:from-brand-400 dark:to-blue-400">
           with Mockmate
          </span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Design complex database schemas visually, define relationships, and let our deterministic AI engine populate millions of rows of production-grade, coherent mock data instantly.</p>
      </div>

      {/* Upload Section */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleContinue}
            className="bg-blue-300 hover:bg-blue-400 text-blue-900 font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            Continue <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div 
          className={`border border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer mb-6 relative
            ${isDragging ? 'border-blue-400 bg-blue-500/5' : 'border-gray-500 hover:border-blue-400 hover:bg-white/5'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="mb-4 text-gray-300">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Selected <span className="text-blue-400">{files.length}</span> Files</h2>
          <p className="text-gray-400">
            Drag and drop files here or click to <span className="text-blue-400 border-b border-dashed border-blue-400 pb-0.5">input from explorer</span>
          </p>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden" 
            accept=".js"
            multiple 
          />
        </div>

        {/* MongoDB Config Area */}
        <div className="border border-gray-700 bg-gray-800/30 rounded-xl p-6">
          <label className="flex items-start gap-4 cursor-pointer">
            <div className="pt-1">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Do you wanna insert the generated data in MongoDB</h3>
              <p className="text-sm text-gray-400 mb-4">Configure connection to automatically sync generated mock data.</p>
              <input 
                type="text" 
                placeholder="MongoDB URI ( mongodb+srv://............ )"
                className="w-full bg-white text-gray-900 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>
          </label>
        </div>

        {/* File List Area (Optional but kept for feedback) */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
              Uploaded Files ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`} 
                  className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-brand-500/30 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-500/10 p-2 rounded-lg text-brand-500 dark:text-brand-400">
                      <File className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-[200px] sm:max-w-sm">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
