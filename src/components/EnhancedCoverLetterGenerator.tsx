
import React, { useState } from 'react';
import { FileText, Download, User, Building, PenTool, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';

interface EnhancedCoverLetterGeneratorProps {
  onGenerate: (data: {
    userName: string;
    jobTitle: string;
    companyName: string;
    tone: string;
    resumeText?: string;
  }) => void;
  coverLetter?: {
    content: string;
    tone: string;
    personalization: string[];
  };
  isLoading: boolean;
}

const EnhancedCoverLetterGenerator: React.FC<EnhancedCoverLetterGeneratorProps> = ({ 
  onGenerate, 
  coverLetter, 
  isLoading 
}) => {
  const [userName, setUserName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [tone, setTone] = useState('professional');
  const [resumeText, setResumeText] = useState('');

  const tones = [
    { id: 'professional', label: 'Professional', color: 'bg-blue-500' },
    { id: 'enthusiastic', label: 'Enthusiastic', color: 'bg-orange-500' },
    { id: 'confident', label: 'Confident', color: 'bg-purple-500' },
    { id: 'creative', label: 'Creative', color: 'bg-pink-500' }
  ];

  const handleGenerate = () => {
    if (userName.trim() && jobTitle.trim()) {
      onGenerate({
        userName: userName.trim(),
        jobTitle: jobTitle.trim(),
        companyName: companyName.trim(),
        tone,
        resumeText: resumeText.trim()
      });
    }
  };

  const handleDownloadPDF = () => {
    if (coverLetter) {
      const element = document.createElement('a');
      const file = new Blob([coverLetter.content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `cover-letter-${jobTitle.replace(/\s+/g, '-').toLowerCase()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="grid gap-8">
      
      {/* --- GENERATOR INPUT STATION --- */}
      <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-gray-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] p-6 md:p-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b-4 border-black dark:border-gray-600 pb-4">
          <div className="bg-purple-600 text-white p-3 border-2 border-black dark:border-white">
             <PenTool className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
              Cover Letter Draft
            </h2>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Automated Writing Assistant
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-black uppercase text-black dark:text-gray-200">
                <User className="w-4 h-4" /> Your Name *
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Yogesh Khinhi"
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transition-shadow font-bold dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-black uppercase text-black dark:text-gray-200">
                <Building className="w-4 h-4" /> Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Google, Microsoft, etc."
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transition-shadow font-bold dark:text-white"
              />
            </div>
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-black uppercase text-black dark:text-gray-200">
              <Briefcase className="w-4 h-4" /> Job Title *
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Senior Software Engineer..."
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transition-shadow font-bold dark:text-white"
            />
          </div>

          {/* Resume Context */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-black uppercase text-black dark:text-gray-200">
              <FileText className="w-4 h-4" /> Resume Context (Optional)
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste specific achievements to mention..."
              className="w-full h-24 p-3 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-500 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transition-shadow font-mono text-sm resize-none dark:text-white"
            />
          </div>

          {/* Tone Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-black uppercase text-black dark:text-gray-200">
              <Sparkles className="w-4 h-4" /> Select Vibe
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tones.map((toneOption) => {
                const isSelected = tone === toneOption.id;
                return (
                  <button
                    key={toneOption.id}
                    onClick={() => setTone(toneOption.id)}
                    className={`
                      relative p-3 border-2 transition-all duration-200 font-bold uppercase text-xs md:text-sm text-left
                      ${isSelected 
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white translate-x-1 translate-y-1' 
                        : 'bg-white dark:bg-gray-800 text-black dark:text-gray-300 border-black dark:border-gray-500 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]'
                      }
                    `}
                  >
                    {/* Small Color Indicator */}
                    <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${toneOption.color}`}></span>
                    {toneOption.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!userName.trim() || !jobTitle.trim() || isLoading}
            className="w-full py-4 mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-black uppercase tracking-widest border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            {isLoading ? (
               <>
                 <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                 Generating...
               </>
            ) : (
               <>
                 <PenTool className="w-5 h-5" />
                 Generate Draft
               </>
            )}
          </button>
        </div>
      </div>

      {/* --- RESULTS SECTION --- */}
      {coverLetter && (
        <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-gray-500 shadow-[12px_12px_0px_0px_rgba(168,85,247,1)] dark:shadow-[12px_12px_0px_0px_rgba(168,85,247,0.4)] p-6 md:p-8 animate-in slide-in-from-bottom-4">
          
          <div className="flex items-center justify-between mb-6 border-b-4 border-black dark:border-gray-600 pb-4">
            <h3 className="text-2xl font-black text-black dark:text-white uppercase flex items-center gap-2">
              <span className="bg-purple-500 text-white p-1 border-2 border-black dark:border-white">
                  <CheckCircle2 className="w-6 h-6" />
              </span>
              Final Draft
            </h3>
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex items-center gap-2 uppercase text-sm"
            >
              <Download className="w-4 h-4" />
              Save PDF
            </button>
          </div>

          {/* Typewriter Effect Content */}
          <div className="relative mb-6">
            <div className="absolute top-0 left-0 bg-black text-white text-xs font-bold px-2 py-1 uppercase z-10 border border-black">
                Typewriter Mode
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-500 p-8 pt-10 shadow-inner">
              <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed font-serif text-base md:text-lg">
                {coverLetter.content}
              </div>
            </div>
          </div>

          {/* Personalization Details Badge */}
          <div className="bg-green-100 dark:bg-green-900/30 border-4 border-green-600 dark:border-green-500 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
            <h4 className="text-lg font-black text-green-900 dark:text-green-300 uppercase mb-3">
                Active Personalizations:
            </h4>
            <ul className="grid md:grid-cols-2 gap-2">
              {coverLetter.personalization.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-green-900 dark:text-green-200 font-bold text-sm">
                  <span className="mt-1 w-2 h-2 bg-green-600 rounded-full shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCoverLetterGenerator;