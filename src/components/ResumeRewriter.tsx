import React, { useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { BulletImprovement } from '../types/analysis';

interface ResumeRewriterProps {
  improvements: BulletImprovement[];
  onRewriteRequest: (text: string) => void;
  isLoading: boolean;
}

const ResumeRewriter: React.FC<ResumeRewriterProps> = ({ improvements, onRewriteRequest, isLoading }) => {
  const [customText, setCustomText] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCustomRewrite = () => {
    if (customText.trim()) {
      onRewriteRequest(customText.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Custom Rewrite Section */}
      <div className="bg-yellow-300 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center mb-4">
          <Wand2 className="w-6 h-6 mr-2 text-black" />
          <h3 className="text-xl font-black text-black uppercase">AI REWRITER</h3>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your bullet point or experience description here for AI improvement..."
            className="w-full h-32 p-4 text-lg font-bold border-4 border-black focus:outline-none focus:bg-white resize-none"
          />
          
          <button
            onClick={handleCustomRewrite}
            disabled={!customText.trim() || isLoading}
            className="px-6 py-3 bg-purple-400 text-black font-black border-4 border-black
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200
              uppercase tracking-wider disabled:opacity-50"
          >
            {isLoading ? 'REWRITING...' : 'IMPROVE TEXT'}
          </button>
        </div>
      </div>

      {/* Improvement Suggestions */}
      {improvements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-black uppercase tracking-wider">
            🔥 BULLET POINT IMPROVEMENTS
          </h3>
          
          {improvements.map((improvement, index) => (
            <div key={index} className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Original */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-black text-red-600 uppercase">❌ ORIGINAL (WEAK)</h4>
                  <button
                    onClick={() => handleCopy(improvement.original, index * 2)}
                    className="p-2 bg-gray-200 border-2 border-black hover:bg-gray-300 transition-colors"
                  >
                    {copiedIndex === index * 2 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-black font-bold bg-red-100 p-3 border-2 border-black">
                  {improvement.original}
                </p>
              </div>

              {/* Improved */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-black text-green-600 uppercase">✅ IMPROVED (STRONG)</h4>
                  <button
                    onClick={() => handleCopy(improvement.improved, index * 2 + 1)}
                    className="p-2 bg-gray-200 border-2 border-black hover:bg-gray-300 transition-colors"
                  >
                    {copiedIndex === index * 2 + 1 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-black font-bold bg-green-100 p-3 border-2 border-black">
                  {improvement.improved}
                </p>
              </div>

              {/* Reason */}
              <div className="bg-blue-100 p-3 border-2 border-black">
                <h4 className="text-sm font-black text-black uppercase mb-1">WHY THIS IS BETTER:</h4>
                <p className="text-black font-bold text-sm">{improvement.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeRewriter;