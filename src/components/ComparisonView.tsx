import React from 'react';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AnalysisReport } from '../types/analysis';

interface ComparisonViewProps {
  reports: AnalysisReport[];
  onClose: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ reports, onClose }) => {
  if (reports.length < 2) return null;

  const [report1, report2] = reports;
  
  const getScoreChange = (score1: number, score2: number) => {
    const diff = score2 - score1;
    if (diff > 0) return { icon: TrendingUp, color: 'text-green-600', text: `+${diff}` };
    if (diff < 0) return { icon: TrendingDown, color: 'text-red-600', text: `${diff}` };
    return { icon: Minus, color: 'text-gray-600', text: '0' };
  };

  const scoreMetrics = [
    { key: 'score', label: 'Overall Score' },
    { key: 'ats_compatibility', label: 'ATS Score' },
    { key: 'grammar_score', label: 'Grammar Score' },
    { key: 'readability_score', label: 'Readability Score' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-purple-400 p-6 border-b-4 border-black">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-black uppercase">RESUME COMPARISON</h2>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black text-white font-black border-4 border-white
                shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]
                hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200
                uppercase tracking-wider"
            >
              CLOSE
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Version Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-200 p-4 border-4 border-black">
              <h3 className="font-black text-black uppercase mb-2">VERSION A</h3>
              <p className="font-bold text-black">{report1.version_name || 'Original'}</p>
              <p className="text-sm font-bold text-gray-600">
                {new Date(report1.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="bg-green-200 p-4 border-4 border-black">
              <h3 className="font-black text-black uppercase mb-2">VERSION B</h3>
              <p className="font-bold text-black">{report2.version_name || 'Updated'}</p>
              <p className="text-sm font-bold text-gray-600">
                {new Date(report2.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Score Comparison */}
          <div className="bg-yellow-200 p-6 border-4 border-black">
            <h3 className="text-xl font-black text-black uppercase mb-4">SCORE COMPARISON</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {scoreMetrics.map(metric => {
                const score1 = report1.analysis_results[metric.key as keyof typeof report1.analysis_results] as number;
                const score2 = report2.analysis_results[metric.key as keyof typeof report2.analysis_results] as number;
                const change = getScoreChange(score1, score2);
                const ChangeIcon = change.icon;

                return (
                  <div key={metric.key} className="bg-white p-4 border-2 border-black text-center">
                    <h4 className="font-black text-black uppercase text-sm mb-2">{metric.label}</h4>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg font-black text-black">{score1}</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                      <span className="text-lg font-black text-black">{score2}</span>
                    </div>
                    <div className={`flex items-center justify-center mt-2 ${change.color}`}>
                      <ChangeIcon className="w-4 h-4 mr-1" />
                      <span className="font-black text-sm">{change.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Weaknesses Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-black text-black uppercase">STRENGTHS EVOLUTION</h3>
              
              <div className="bg-green-200 p-4 border-4 border-black">
                <h4 className="font-black text-black uppercase mb-2">VERSION A</h4>
                <ul className="space-y-1">
                  {report1.analysis_results.strengths.slice(0, 3).map((strength, index) => (
                    <li key={index} className="text-black font-bold text-sm flex items-start">
                      <span className="mr-2">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-green-300 p-4 border-4 border-black">
                <h4 className="font-black text-black uppercase mb-2">VERSION B</h4>
                <ul className="space-y-1">
                  {report2.analysis_results.strengths.slice(0, 3).map((strength, index) => (
                    <li key={index} className="text-black font-bold text-sm flex items-start">
                      <span className="mr-2">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black text-black uppercase">WEAKNESSES EVOLUTION</h3>
              
              <div className="bg-red-200 p-4 border-4 border-black">
                <h4 className="font-black text-black uppercase mb-2">VERSION A</h4>
                <ul className="space-y-1">
                  {report1.analysis_results.weaknesses.slice(0, 3).map((weakness, index) => (
                    <li key={index} className="text-black font-bold text-sm flex items-start">
                      <span className="mr-2">•</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-300 p-4 border-4 border-black">
                <h4 className="font-black text-black uppercase mb-2">VERSION B</h4>
                <ul className="space-y-1">
                  {report2.analysis_results.weaknesses.slice(0, 3).map((weakness, index) => (
                    <li key={index} className="text-black font-bold text-sm flex items-start">
                      <span className="mr-2">•</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Skills Comparison */}
          <div className="bg-cyan-200 p-6 border-4 border-black">
            <h3 className="text-xl font-black text-black uppercase mb-4">SKILLS EVOLUTION</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-black text-black uppercase mb-2">NEW SKILLS DETECTED</h4>
                <div className="flex flex-wrap gap-2">
                  {report2.analysis_results.hard_skills
                    .filter(skill => !report1.analysis_results.hard_skills.includes(skill))
                    .map((skill, index) => (
                      <span key={index} className="bg-green-500 text-white px-2 py-1 font-bold text-xs border-2 border-black">
                        +{skill}
                      </span>
                    ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-black text-black uppercase mb-2">REMOVED SKILLS</h4>
                <div className="flex flex-wrap gap-2">
                  {report1.analysis_results.hard_skills
                    .filter(skill => !report2.analysis_results.hard_skills.includes(skill))
                    .map((skill, index) => (
                      <span key={index} className="bg-red-500 text-white px-2 py-1 font-bold text-xs border-2 border-black">
                        -{skill}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;