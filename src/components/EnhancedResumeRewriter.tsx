
import React, { useState } from 'react';
import { Wand2, Download, FileText, Settings, Briefcase, PenTool, CheckCircle2 } from 'lucide-react';

interface EnhancedResumeRewriterProps {
  onRewrite: (resumeText: string, tone: string, targetRole: string) => void;
  rewrittenResume?: {
    content: string;
    improvements: string[];
    tone: string;
  };
  isLoading: boolean;
}

const EnhancedResumeRewriter: React.FC<EnhancedResumeRewriterProps> = ({ 
  onRewrite, 
  rewrittenResume, 
  isLoading 
}) => {
  const [resumeText, setResumeText] = useState('');
  const [tone, setTone] = useState('professional');
  const [targetRole, setTargetRole] = useState('');

  const tones = [
    { id: 'professional', label: 'Professional', description: 'Formal & Polished' },
    { id: 'creative', label: 'Creative', description: 'Bold & Expressive' },
    { id: 'ats-optimized', label: 'ATS-Bot', description: 'Keyword Heavy' },
    { id: 'executive', label: 'Executive', description: 'Strategic Impact' }
  ];

  const handleRewrite = () => {
    if (resumeText.trim()) {
      onRewrite(resumeText.trim(), tone, targetRole);
    }
  };

  const handleDownloadPDF = () => {
    if (rewrittenResume) {
      const element = document.createElement('a');
      const file = new Blob([rewrittenResume.content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `enhanced-resume-${tone}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="grid gap-8">
      
      {/* --- INPUT SECTION --- */}
      <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-gray-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] p-6 md:p-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b-4 border-black dark:border-gray-600 pb-4">
          <div className="bg-blue-600 text-white p-3 border-2 border-black dark:border-white">
             <Wand2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
              Resume Rewriter
            </h2>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              AI-Powered Refinement Engine
            </p>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Resume Text Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-black uppercase text-black dark:text-gray-200">
              <FileText className="w-4 h-4" /> Paste Content
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here. Don't worry about formatting..."
              className="w-full h-48 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transition-shadow font-mono text-sm resize-none dark:text-white"
            />
          </div>

          {/* Target Role */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-black uppercase text-black dark:text-gray-200">
              <Briefcase className="w-4 h-4" /> Target Role (Optional)
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Product Designer"
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transition-shadow font-bold dark:text-white"
            />
          </div>

          {/* Tone Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-black uppercase text-black dark:text-gray-200">
              <Settings className="w-4 h-4" /> Select Tone
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tones.map((toneOption) => {
                 const isSelected = tone === toneOption.id;
                 return (
                  <div
                    key={toneOption.id}
                    onClick={() => setTone(toneOption.id)}
                    className={`
                      cursor-pointer border-2 p-4 transition-all duration-200
                      ${isSelected 
                        ? 'bg-black dark:bg-white border-black dark:border-white translate-x-1 translate-y-1' 
                        : 'bg-white dark:bg-gray-800 border-black dark:border-gray-500 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-black uppercase text-sm ${isSelected ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>
                            {toneOption.label}
                        </h4>
                        <p className={`text-xs font-medium mt-1 ${isSelected ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                            {toneOption.description}
                        </p>
                      </div>
                      {isSelected && <CheckCircle2 className={`w-6 h-6 ${isSelected ? 'text-green-400 dark:text-green-600' : ''}`} />}
                    </div>
                  </div>
                 );
              })}
            </div>
          </div>

          {/* Rewrite Button */}
          <button
            onClick={handleRewrite}
            disabled={!resumeText.trim() || isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-black uppercase tracking-widest border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Rewriting...
                </>
            ) : (
                <>
                    <PenTool className="w-5 h-5" />
                    Enhance Resume Now
                </>
            )}
          </button>
        </div>
      </div>

      {/* --- RESULTS SECTION --- */}
      {rewrittenResume && (
        <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-gray-500 shadow-[12px_12px_0px_0px_rgba(34,197,94,1)] dark:shadow-[12px_12px_0px_0px_rgba(34,197,94,0.4)] p-6 md:p-8 animate-in slide-in-from-bottom-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b-4 border-black dark:border-gray-600 pb-4">
            <h3 className="text-2xl font-black text-black dark:text-white uppercase flex items-center gap-2">
              <span className="bg-green-500 text-white p-1 border-2 border-black dark:border-white">
                  <CheckCircle2 className="w-6 h-6" />
              </span>
              Result: {rewrittenResume.tone}
            </h3>
            
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex items-center gap-2 uppercase text-sm"
            >
              <Download className="w-4 h-4" />
              Download .TXT
            </button>
          </div>

          {/* Enhanced Resume Content */}
          <div className="relative mb-8">
            <div className="absolute top-0 left-0 bg-black text-white text-xs font-bold px-2 py-1 uppercase z-10">
                Preview
            </div>
            <div className="w-full h-96 p-6 pt-8 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-500 overflow-y-auto font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              <pre className="whitespace-pre-wrap font-mono">{rewrittenResume.content}</pre>
            </div>
          </div>

          {/* Improvements Made */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-8 border-blue-600 dark:border-blue-400 p-6">
            <h4 className="text-lg font-black text-blue-900 dark:text-blue-100 uppercase mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Key Enhancements
            </h4>
            <ul className="grid md:grid-cols-2 gap-3">
              {rewrittenResume.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-800 dark:text-gray-200 font-medium text-sm">
                  <span className="shrink-0 w-6 h-6 bg-blue-600 text-white flex items-center justify-center font-bold text-xs border-2 border-black dark:border-blue-300">
                      {index + 1}
                  </span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple helper icon for the improvements section
function Sparkles({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    )
}

export default EnhancedResumeRewriter;