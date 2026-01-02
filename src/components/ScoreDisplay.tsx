
import React from 'react';

interface ScoreDisplayProps {
 score: number;
  atsCompatibility: number;
  grammarScore: number;      // Added prop
  readabilityScore: number;  // Added prop
  strengths: string[];
  weaknesses: string[];
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, atsCompatibility, grammarScore, readabilityScore, strengths, weaknesses }) => {
  return (
    <div className="space-y-6">
      
      {/* 1. KEY METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Overall Score Card */}
        <div className="bg-lime-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black mb-2 text-black uppercase">OVERALL SCORE</h3>
          <div className="flex items-end mb-4">
            <span className="text-6xl font-black text-black leading-none">{score}</span>
            <span className="text-2xl font-bold text-black mb-1 ml-1">/100</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-white h-4 border-2 border-black">
            <div 
              className="h-full bg-black transition-all duration-1000"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Grammar Score Card (Pink) */}
        <div className="bg-pink-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black mb-2 text-black uppercase">GRAMMAR</h3>
          <div className="flex items-end mb-4">
            <span className="text-6xl font-black text-black leading-none">{grammarScore}</span>
            <span className="text-2xl font-bold text-black mb-1 ml-1">/100</span>
          </div>
          <div className="w-full bg-white h-4 border-2 border-black">
            <div 
              className="h-full bg-black transition-all duration-1000"
              style={{ width: `${grammarScore}%` }}
            />
          </div>
        </div>

        {/* Readability Score Card (Yellow) */}
        <div className="bg-yellow-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black mb-2 text-black uppercase">READABILITY</h3>
          <div className="flex items-end mb-4">
            <span className="text-6xl font-black text-black leading-none">{readabilityScore}</span>
            <span className="text-2xl font-bold text-black mb-1 ml-1">/100</span>
          </div>
          <div className="w-full bg-white h-4 border-2 border-black">
            <div 
              className="h-full bg-black transition-all duration-1000"
              style={{ width: `${readabilityScore}%` }}
            />
          </div>
        </div>

        {/* ATS Compatibility Card */}
        <div className="bg-cyan-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black mb-2 text-black uppercase">ATS COMPATIBILITY</h3>
          <div className="flex items-end mb-4">
            <span className="text-6xl font-black text-black leading-none">{atsCompatibility}</span>
            <span className="text-2xl font-bold text-black mb-1 ml-1">/100</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-white h-4 border-2 border-black">
            <div 
              className="h-full bg-black transition-all duration-1000"
              style={{ width: `${atsCompatibility}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. INSIGHTS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths List */}
        <div className="bg-green-100 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black mb-4 text-black uppercase flex items-center">
            💪 STRENGTHS
          </h3>
          <ul className="space-y-3">
            {strengths.length > 0 ? (
              strengths.map((strength, index) => (
                <li key={index} className="text-black font-bold flex items-start text-sm md:text-base">
                  <span className="text-green-600 font-black mr-2 text-lg leading-none">•</span>
                  {strength}
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No specific strengths detected.</li>
            )}
          </ul>
        </div>

        {/* Weaknesses List */}
        <div className="bg-red-100 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black mb-4 text-black uppercase flex items-center">
            ⚠️ IMPROVEMENTS
          </h3>
          <ul className="space-y-3">
            {weaknesses.length > 0 ? (
              weaknesses.map((weakness, index) => (
                <li key={index} className="text-black font-bold flex items-start text-sm md:text-base">
                  <span className="text-red-600 font-black mr-2 text-lg leading-none">•</span>
                  {weakness}
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No critical weaknesses detected.</li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ScoreDisplay;