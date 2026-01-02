import React, { useState } from 'react';
import { FileText, Download, Copy, Check } from 'lucide-react';
import { CoverLetter } from '../types/analysis';

interface CoverLetterGeneratorProps {
  onGenerate: (tone: string, jobTitle: string, companyName: string) => void;
  coverLetter?: CoverLetter;
  isLoading: boolean;
}

const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ 
  onGenerate, 
  coverLetter, 
  isLoading 
}) => {
  const [tone, setTone] = useState('professional');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (jobTitle.trim()) {
      onGenerate(tone, jobTitle.trim(), companyName.trim());
    }
  };

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
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

  const tones = [
    { id: 'professional', label: 'Professional', color: 'bg-blue-400' },
    { id: 'enthusiastic', label: 'Enthusiastic', color: 'bg-orange-400' },
    { id: 'confident', label: 'Confident', color: 'bg-purple-400' },
    { id: 'creative', label: 'Creative', color: 'bg-pink-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <div className="bg-cyan-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 mr-2 text-black" />
          <h3 className="text-xl font-black text-black uppercase">COVER LETTER GENERATOR</h3>
        </div>

        <div className="space-y-4">
          {/* Job Title */}
          <div>
            <label className="block text-lg font-black text-black uppercase mb-2">
              JOB TITLE *
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="w-full p-4 text-lg font-bold border-4 border-black focus:outline-none focus:bg-yellow-100"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-lg font-black text-black uppercase mb-2">
              COMPANY NAME (OPTIONAL)
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Google, Microsoft"
              className="w-full p-4 text-lg font-bold border-4 border-black focus:outline-none focus:bg-yellow-100"
            />
          </div>

          {/* Tone Selection */}
          <div>
            <label className="block text-lg font-black text-black uppercase mb-4">
              TONE & STYLE
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tones.map((toneOption) => (
                <button
                  key={toneOption.id}
                  onClick={() => setTone(toneOption.id)}
                  className={`
                    p-4 border-4 border-black font-black text-sm uppercase tracking-wider
                    transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                    hover:translate-x-[-2px] hover:translate-y-[-2px]
                    ${tone === toneOption.id 
                      ? `${toneOption.color} text-black transform translate-x-[-2px] translate-y-[-2px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]` 
                      : 'bg-white text-black hover:bg-gray-100'
                    }
                  `}
                >
                  {toneOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!jobTitle.trim() || isLoading}
            className="w-full px-6 py-4 bg-lime-400 text-black font-black border-4 border-black
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200
              uppercase tracking-wider text-xl disabled:opacity-50"
          >
            {isLoading ? 'GENERATING...' : 'GENERATE COVER LETTER'}
          </button>
        </div>
      </div>

      {/* Generated Cover Letter */}
      {coverLetter && (
        <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-black uppercase">YOUR COVER LETTER</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-400 text-black font-black border-4 border-black
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                  hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200
                  uppercase tracking-wider"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-400 text-black font-black border-4 border-black
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                  hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200
                  uppercase tracking-wider"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-6 border-2 border-black">
            <div className="whitespace-pre-wrap text-black font-medium leading-relaxed">
              {coverLetter.content}
            </div>
          </div>

          {/* Key Points */}
          <div className="mt-6 bg-yellow-100 p-4 border-2 border-black">
            <h4 className="text-lg font-black text-black uppercase mb-2">KEY POINTS HIGHLIGHTED:</h4>
            <ul className="space-y-1">
              {coverLetter.key_points.map((point, index) => (
                <li key={index} className="text-black font-bold flex items-start">
                  <span className="text-black font-black mr-2">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterGenerator;