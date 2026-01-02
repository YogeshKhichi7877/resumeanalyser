import React from 'react';
import { Lightbulb, Target, Zap } from 'lucide-react';

interface ImprovementTipsProps {
  improvements: string[];
  keywords: string[];
  summary: string;
}

const ImprovementTips: React.FC<ImprovementTipsProps> = ({ improvements, keywords, summary }) => {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-yellow-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center mb-4">
          <Target className="w-6 h-6 mr-2 text-black" />
          <h3 className="text-xl font-black text-black uppercase">EXECUTIVE SUMMARY</h3>
        </div>
        <p className="text-black font-bold text-lg">{summary}</p>
      </div>

      {/* Improvement Tips */}
      <div className="bg-orange-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center mb-4">
          <Lightbulb className="w-6 h-6 mr-2 text-black" />
          <h3 className="text-xl font-black text-black uppercase">OPTIMIZATION TIPS</h3>
        </div>
        <div className="space-y-4">
          {improvements.map((tip, index) => (
            <div key={index} className="flex items-start">
              <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-black text-sm mr-4 flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-black font-bold text-lg">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-purple-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center mb-4">
          <Zap className="w-6 h-6 mr-2 text-black" />
          <h3 className="text-xl font-black text-black uppercase">KEY BUZZWORDS</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {keywords.map((keyword, index) => (
            <span 
              key={index}
              className="bg-black text-white px-4 py-2 font-black text-sm uppercase tracking-wider border-2 border-black"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImprovementTips;