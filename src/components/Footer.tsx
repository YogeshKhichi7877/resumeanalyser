
import React from 'react';
import { Github, Twitter, Linkedin, Heart, FileText, Zap, AlertTriangle } from 'lucide-react';

const Footer = () => {
  return (
   <footer className="w-full bg-white dark:bg-gray-800 border-t-4 border-black dark:border-gray-500 mt-20">
      <div className="max-w-8xl mx-auto">
        
        {/* Main Grid with thick dividers */}
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black dark:divide-gray-500">
          
          {/* Column 1: Brand & tagline */}
          <div className="p-8 space-y-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <FileText className="w-8 h-8" />
              <span className="text-2xl font-black uppercase tracking-tighter text-black dark:text-white">
                Resume Pro
              </span>
            </div>
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
              Analyse your resume with precision and land your dream job.
            </p>
            <div className="pt-4 flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-white dark:bg-gray-700 border-2 border-black dark:border-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-none transition-all">
                  <Icon className="w-5 h-5 text-black dark:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="p-8">
            <h4 className="font-black uppercase text-lg mb-6 bg-yellow-300 dark:bg-yellow-600 inline-block px-2 border-2 border-black dark:border-transparent text-black">
              Platform
            </h4>
            <ul className="space-y-3 font-bold text-sm">
              {['Builder', 'Templates', 'ATS Checker', 'Pricing'].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center group text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                    <span className="w-2 h-2 bg-black dark:bg-white mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="p-8">
            <h4 className="font-black uppercase text-lg mb-6 bg-green-300 dark:bg-green-600 inline-block px-2 border-2 border-black dark:border-transparent text-black">
              Resources
            </h4>
            <ul className="space-y-3 font-bold text-sm">
              {['Blog', 'Career Guide', 'Examples', 'Help Center'].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center group text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                    <span className="w-2 h-2 bg-black dark:bg-white mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

             {/* Column 4: NEW "Mission Sticker" Pattern */}
          <div className="relative p-8 overflow-hidden bg-blue-50 dark:bg-blue-900/20 flex flex-col justify-center">
            
            {/* Diagonal background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)' , backgroundSize: '20px 20px' }}>
            </div>

            {/* "Sticker" Content */}
            <div className="relative z-10 bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transform rotate-2 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-red-500 text-white p-2 border-2 border-black dark:border-white">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="font-black uppercase text-lg text-black dark:text-white leading-none">
                        Our Mission
                    </h4>
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-tight">
                    To empower every job seeker with tools that break through the noise and land interviews.
                </p>
                <div className="mt-4 flex gap-2">
                    <span className="w-3 h-3 bg-blue-500 border-2 border-black"></span>
                    <span className="w-3 h-3 bg-yellow-500 border-2 border-black"></span>
                    <span className="w-3 h-3 bg-green-500 border-2 border-black"></span>
                </div>
            </div>
          </div>

        </div>
        
        {/* --- AI DISCLAIMER / WARNING STRIP --- */}
        <div className="bg-yellow-200 dark:bg-yellow-600 border-t-4 border-black dark:border-gray-500 p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="bg-black text-yellow-400 p-2 shrink-0 border-2 border-transparent">
                <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
                <h5 className="font-black uppercase text-sm text-black dark:text-white">AI Usage & Accuracy Disclaimer</h5>
                <p className="text-xs font-bold text-black/80 dark:text-white/90 leading-relaxed max-w-5xl">
                    This platform leverages Artificial Intelligence to analyze and generate content. While we strive for precision, AI models can make mistakes, hallucinate facts, or lack specific context. 
                    All suggestions provided should be treated as <span className="underline decoration-2">assistive guidance</span> rather than absolute professional advice. 
                    Please review all outputs manually before submitting your resume to employers.
                </p>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-4 border-black dark:border-gray-500 p-6 flex flex-col md:flex-row justify-center items-center gap-4 bg-gray-100 dark:bg-gray-900">
  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
    © 2026 Resume Pro Inc.
  </p>
  
  {/* Removed 'pr-8' here to ensure perfect centering */}
  <div className="flex items-center gap-2 text-xs font-bold uppercase">
    <span>Made and Maintained by </span>
    <Heart className="w-4 h-4 text-red-500 fill-current" />
    <span>Yogesh Khinchi </span>
  </div>
</div>
      </div>
    </footer>
  );
};

export default Footer;