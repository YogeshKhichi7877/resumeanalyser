import React, { useState } from 'react';
import { Target, TrendingUp, AlertCircle, Upload } from 'lucide-react';
import { JDMatchResult } from '../types/analysis';

interface JDMatchResultsProps {
  onJDUpload: (jdText: string) => void;
  matchResult?: JDMatchResult;
  isLoading: boolean;
}

const JDMatchResults: React.FC<JDMatchResultsProps> = ({ onJDUpload, matchResult, isLoading }) => {
  const [jdText, setJdText] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = () => {
    if (jdText.trim()) {
      onJDUpload(jdText.trim());
      setShowInput(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-400';
    if (percentage >= 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-6">
      {/* JD Upload Section */}
      <div className="bg-cyan-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Target className="w-6 h-6 mr-2 text-black" />
            <h3 className="text-xl font-black text-black uppercase">JOB DESCRIPTION MATCH</h3>
          </div>
          
          <button
            onClick={() => setShowInput(!showInput)}
            className="px-4 py-2 bg-black text-white font-black border-4 border-black
              shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]
              hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200
              uppercase tracking-wider"
          >
            <Upload className="w-4 h-4 inline mr-2" />
            {showInput ? 'CANCEL' : 'ADD JD'}
          </button>
        </div>

        {showInput && (
          <div className="space-y-4">
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-40 p-4 text-lg font-bold border-4 border-black focus:outline-none focus:bg-yellow-100 resize-none"
            />
            <button
              onClick={handleSubmit}
              disabled={!jdText.trim() || isLoading}
              className="px-6 py-3 bg-lime-400 text-black font-black border-4 border-black
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200
                uppercase tracking-wider disabled:opacity-50"
            >
              {isLoading ? 'ANALYZING...' : 'ANALYZE MATCH'}
            </button>
          </div>
        )}
      </div>

      {/* Match Results */}
      {matchResult && (
        <div className="space-y-6">
          {/* Match Score */}
          <div className={`${getMatchColor(matchResult.match_percentage)} p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 mr-2 text-black" />
                <h3 className="text-2xl font-black text-black uppercase">MATCH SCORE</h3>
              </div>
              <div className="text-6xl font-black text-black mb-2">{matchResult.match_percentage}%</div>
              <div className="text-xl font-black text-black uppercase">
                Role Fit: {matchResult.role_fit_score}/100
              </div>
            </div>
          </div>

          {/* Keywords Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-green-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black mb-4 text-black uppercase">✅ MATCHED KEYWORDS</h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.matched_keywords.map((keyword, index) => (
                  <span key={index} className="bg-black text-white px-3 py-1 font-bold text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-red-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black mb-4 text-black uppercase">❌ MISSING KEYWORDS</h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.missing_keywords.map((keyword, index) => (
                  <span key={index} className="bg-black text-white px-3 py-1 font-bold text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="bg-orange-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 mr-2 text-black" />
              <h3 className="text-xl font-black text-black uppercase">SKILL GAPS</h3>
            </div>
            <ul className="space-y-2">
              {matchResult.skill_gaps.map((gap, index) => (
                <li key={index} className="text-black font-bold flex items-start">
                  <span className="text-black font-black mr-2">•</span>
                  {gap}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-purple-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black mb-4 text-black uppercase">🎯 RECOMMENDATIONS</h3>
            <ul className="space-y-3">
              {matchResult.recommendations.map((rec, index) => (
                <li key={index} className="text-black font-bold flex items-start">
                  <div className="bg-black text-white w-6 h-6 flex items-center justify-center font-black text-sm mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default JDMatchResults;