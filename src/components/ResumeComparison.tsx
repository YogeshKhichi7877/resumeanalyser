import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, TrendingUp, TrendingDown, Minus, Trophy, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ResumeAnalysis } from '../types/analysis';

let ApiUrl = 'http://localhost:3011'

// --- Types matching your Backend Response ---
interface BattleResult {
  winner: string;
  winner_id: string;
  verdict: string;
  better_points: string[];
  worse_points: string[];
}

interface ComparisonStats {
  score_diff: number;
  skills_added: string[];
  skills_removed: string[];
}

interface ComparisonData {
  resume1: ResumeAnalysis;
  resume2: ResumeAnalysis;
  battle: BattleResult;
  stats: ComparisonStats;
}

const ResumeComparison: React.FC = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- File Upload Logic ---
  const createDropzone = (onDrop: (files: File[]) => void, file: File | null) => {
    return useDropzone({
      onDrop: (files) => {
        onDrop(files);
        setError(null); // Clear errors on new upload
      },
      accept: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
      disabled: loading
    });
  };

  const dropzone1 = createDropzone((files) => setFile1(files[0]), file1);
  const dropzone2 = createDropzone((files) => setFile2(files[0]), file2);

  // --- API Call Logic (The Fix) ---
  const handleCompare = async () => {
    if (!file1 || !file2) return;
    
    setLoading(true);
    setError(null);
    setComparison(null);

    const formData = new FormData();
    formData.append('resume1', file1);
    formData.append('resume2', file2);

    try {
      // NOTE: Ensure this matches your backend port (usually 3011 based on your server.js)
      const response = await fetch(`${ApiUrl}/api/resume/compare`, {
        method: 'POST',
        body: formData, // Browser automatically sets Content-Type to multipart/form-data
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Comparison failed');
      }

      setComparison(data.data);
    } catch (err: any) {
      console.error("Comparison Error:", err);
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreChange = (score1: number, score2: number) => {
    const diff = score2 - score1;
    if (diff > 0) return { icon: TrendingUp, color: 'text-green-600', text: `+${diff}` };
    if (diff < 0) return { icon: TrendingDown, color: 'text-red-600', text: `${diff}` };
    return { icon: Minus, color: 'text-gray-600', text: '0' };
  };

  return (
    <div className="material-grid max-w-6xl mx-auto p-4">
      {/* --- 1. UPLOAD SECTION --- */}
      <div className="material-card elevation-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-3 text-blue-600" />
          Compare Two Resumes
        </h2>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center border border-red-200">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Resume 1 */}
          <div
            {...dropzone1.getRootProps()}
            className={`
              relative p-8 rounded-xl cursor-pointer transition-all duration-300
              border-2 border-dashed
              ${dropzone1.isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
              ${file1 ? 'border-green-500 bg-green-50 ring-2 ring-green-100' : ''}
            `}
          >
            <input {...dropzone1.getInputProps()} />
            <div className="text-center">
              <Upload className={`w-10 h-10 mx-auto mb-3 ${file1 ? 'text-green-600' : 'text-gray-400'}`} />
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {file1 ? file1.name : 'Resume A (Base)'}
              </h3>
              <p className="text-sm text-gray-500">
                {file1 ? 'Click to change' : 'Drag & drop PDF here'}
              </p>
            </div>
          </div>

          {/* Resume 2 */}
          <div
            {...dropzone2.getRootProps()}
            className={`
              relative p-8 rounded-xl cursor-pointer transition-all duration-300
              border-2 border-dashed
              ${dropzone2.isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
              ${file2 ? 'border-green-500 bg-green-50 ring-2 ring-green-100' : ''}
            `}
          >
            <input {...dropzone2.getInputProps()} />
            <div className="text-center">
              <Upload className={`w-10 h-10 mx-auto mb-3 ${file2 ? 'text-green-600' : 'text-gray-400'}`} />
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {file2 ? file2.name : 'Resume B (Challenger)'}
              </h3>
              <p className="text-sm text-gray-500">
                {file2 ? 'Click to change' : 'Drag & drop PDF here'}
              </p>
            </div>
          </div>
        </div>

        {/* Compare Button */}
        <div className="text-center">
          <button
            onClick={handleCompare}
            disabled={!file1 || !file2 || loading}
            className={`
              px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all transform hover:-translate-y-1
              ${!file1 || !file2 || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 ripple'}
            `}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span> AI is Judging...
              </span>
            ) : 'Start Battle ⚔️'}
          </button>
        </div>
      </div>

      {/* --- 2. BATTLE RESULTS --- */}
      {comparison && (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
          
          {/* A. The Verdict */}
          <div className={`
            p-8 rounded-xl border-l-8 shadow-md flex flex-col md:flex-row items-center gap-6
            ${comparison.battle.winner_id === 'resume1' ? 'bg-blue-50 border-blue-600' : 
              comparison.battle.winner_id === 'resume2' ? 'bg-purple-50 border-purple-600' : 'bg-gray-100 border-gray-500'}
          `}>
            <div className="bg-white p-4 rounded-full shadow-md shrink-0">
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-2">
                Winner: {comparison.battle.winner}
              </h2>
              <p className="text-lg font-medium text-gray-700 italic">
                "{comparison.battle.verdict}"
              </p>
            </div>
            <div className="text-center px-4 py-2 bg-white rounded-lg shadow-sm">
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Score Diff</div>
               <div className={`text-2xl font-black ${comparison.stats.score_diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                 {comparison.stats.score_diff > 0 ? '+' : ''}{comparison.stats.score_diff}
               </div>
            </div>
          </div>

          {/* B. Why they won */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="material-card bg-green-50 border border-green-100 p-6 rounded-xl">
              <h4 className="flex items-center text-lg font-bold text-green-800 mb-4">
                <CheckCircle className="w-5 h-5 mr-2" /> Winning Factors
              </h4>
              <ul className="space-y-3">
                {comparison.battle.better_points.map((pt, i) => (
                  <li key={i} className="flex items-start text-green-900 font-medium text-sm">
                    <span className="mr-2 mt-1">•</span> {pt}
                  </li>
                ))}
              </ul>
            </div>

            <div className="material-card bg-red-50 border border-red-100 p-6 rounded-xl">
              <h4 className="flex items-center text-lg font-bold text-red-800 mb-4">
                <XCircle className="w-5 h-5 mr-2" /> Weak Points
              </h4>
              <ul className="space-y-3">
                {comparison.battle.worse_points.map((pt, i) => (
                  <li key={i} className="flex items-start text-red-900 font-medium text-sm">
                     <span className="mr-2 mt-1">•</span> {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* C. Score Grid */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 ml-1">Head-to-Head Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { key: 'overall', label: 'Overall Score', score1: comparison.resume1.score, score2: comparison.resume2.score },
                { key: 'ats', label: 'ATS Score', score1: comparison.resume1.ats_compatibility, score2: comparison.resume2.ats_compatibility },
                { key: 'grammar', label: 'Grammar', score1: comparison.resume1.grammar_score, score2: comparison.resume2.grammar_score },
                { key: 'readability', label: 'Readability', score1: comparison.resume1.readability_score, score2: comparison.resume2.readability_score }
              ].map(metric => {
                return (
                  <div key={metric.key} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{metric.label}</h4>
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <span className="text-xl font-bold text-gray-400">{metric.score1}</span>
                      <ArrowRight className="w-4 h-4 text-gray-300" />
                      <span className={`text-2xl font-black ${metric.score1 < metric.score2 ? 'text-green-600' : 'text-gray-900'}`}>
                        {metric.score2}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeComparison;