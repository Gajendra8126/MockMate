import React from 'react';
import { Database } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-[var(--color-border)] py-6 mt-10 transition-colors duration-300 relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-500" />
          <span className="font-semibold">Mockmate</span>
        </div>
        <p className="text-sm text-gray-500">
          Mockmate By Tech Crafters ❤️
        </p>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Mockmate. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
