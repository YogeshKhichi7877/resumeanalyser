
import React from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  Brain,
  FileText,
  TrendingUp,
  Search,
  Trophy,          // Added for Projects
  MessageSquare,   // Added for Interview
  Briefcase        // Added for General
} from 'lucide-react';
import { ResumeAnalysis } from '../types/analysis';
import ScoreDisplay from './ScoreDisplay';
import JobHunter from './JobHunter';
import RoastSection from './RoastSection';
import SkillGapLearner from './SkillGapLearner';

interface AnalysisResultsProps {
  analysis: ResumeAnalysis;
  extractedText: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, extractedText }) => {
  
  // 1. Safety Checks: Ensure arrays exist to prevent crashes
  const projects = analysis.top_projects || [];
  const questions = analysis.interview_questions || [];
  const scams = analysis.scam_flags || [];
  const formattingIssues = analysis.formatting_issues || [];
  const grammarIssues = analysis.grammar_issues || [];
  const keywords = analysis.keywords || [];
  const missingKeywords = analysis.missing_keywords || [];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* --- SECTION 1: CORE METRICS --- */}
      <section>
        <h1 className="text-3xl font-black uppercase mb-6 italic">Performance Audit</h1>
        <ScoreDisplay 
          score={analysis.score} 
          atsCompatibility={analysis.ats_compatibility} 
          strengths={analysis.strengths} 
          weaknesses={analysis.weaknesses} 
          grammarScore={analysis.grammar_score}
          readabilityScore={analysis.readability_score}
        />
      </section>

      {/* --- SECTION 2: CRITICAL ALERTS (New Design) --- */}
      {scams.length > 0 && (
        <section className="bg-red-50 border-4 border-red-600 p-6 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-10 h-10 text-red-600 shrink-0" />
            <div>
              <h2 className="text-2xl font-black text-red-800 uppercase mb-2">CRITICAL FLAGS DETECTED</h2>
              <p className="font-bold text-red-700 mb-2">These items look suspicious or impossible:</p>
              <ul className="space-y-2">
                {scams.map((flag, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-medium text-red-900">
                    <XCircle className="w-5 h-5 text-red-600" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* --- SECTION 3: ROAST --- */}
      <section>
        <RoastSection resumeText={extractedText} />
      </section>

      {/* --- SECTION 4: PROJECT IMPACT ANALYSIS --- */}
      {projects.length > 0 && (
        <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-8 border-b-4 border-black pb-4">
            <Trophy className="w-10 h-10 text-yellow-500 fill-current" />
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Project Audit</h2>
              <p className="text-sm font-bold text-gray-500">Ranked by Impact & Complexity</p>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {[...projects]
              .sort((a, b) => b.score - a.score) // SORTING LOGIC: Highest first
              .map((project, idx) => {
                // Dynamic Styling Logic
                const isHigh = project.score >= 8;
                const isMid = project.score >= 5 && project.score < 8;
                
                let cardStyle = "border-black bg-white";
                let badgeStyle = "bg-gray-100 text-gray-800";
                let scoreColor = "text-black";
                let statusText = "Needs Revision";
                let StatusIcon = AlertTriangle;

                if (isHigh) {
                  cardStyle = "border-green-600 bg-green-50/50";
                  badgeStyle = "bg-green-200 text-green-900";
                  scoreColor = "text-green-700";
                  statusText = "Star Project";
                  StatusIcon = CheckCircle;
                } else if (isMid) {
                  cardStyle = "border-yellow-600 bg-yellow-50/50";
                  badgeStyle = "bg-yellow-200 text-yellow-900";
                  scoreColor = "text-yellow-700";
                  statusText = "Solid Entry";
                  StatusIcon = TrendingUp;
                } else {
                  cardStyle = "border-red-600 bg-red-50/50";
                  badgeStyle = "bg-red-200 text-red-900";
                  scoreColor = "text-red-700";
                  statusText = "Weak Impact";
                  StatusIcon = XCircle;
                }

                return (
                  <div key={idx} className={`relative flex flex-col border-4 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${cardStyle}`}>
                    
                    {/* Header: Name & Score */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                         {/* Rank Badge */}
                        <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-black uppercase tracking-wider mb-2 border border-current rounded ${badgeStyle}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusText}
                        </div>
                        <h3 className="font-black text-xl leading-tight">{project.name}</h3>
                      </div>

                      {/* Score Box */}
                      <div className="flex flex-col items-center justify-center bg-white border-2 border-black p-2 min-w-[60px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <span className={`text-2xl font-black ${scoreColor}`}>{project.score}</span>
                        <span className="text-[10px] font-bold uppercase text-gray-500">/10</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-0.5 w-full bg-black/10 mb-4"></div>

                    {/* Body: Reason */}
                    <p className="text-gray-800 font-medium leading-relaxed text-sm">
                      {project.reason}
                    </p>
                  </div>
                );
              })}
          </div>
        </section>
      )}



      {/* --- SECTION 5: INTERVIEW PREP (New Design) --- */}
      {questions.length > 0 && (
        <section className="bg-indigo-50 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-8 h-8 text-indigo-700" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-indigo-900">
              Interview Drill Room
            </h2>
          </div>

          <div className="grid gap-4">
            {questions.map((q, idx) => (
              <div key={idx} className="bg-white border-2 border-indigo-900 p-5 group hover:translate-x-1 transition-transform">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-indigo-500 shrink-0" />
                      <h4 className="font-bold text-lg text-gray-900">{q.question}</h4>
                    </div>
                    <div className="pl-7 text-sm text-gray-600 border-l-4 border-indigo-100 italic">
                      " {q.reason} "
                    </div>
                  </div>
                  
                  <span className={`shrink-0 px-3 py-1 text-xs font-black uppercase border-2 border-black self-start whitespace-nowrap ${
                    q.importance === 'High' ? 'bg-red-500 text-white' : 
                    q.importance === 'Medium' ? 'bg-yellow-400 text-black' : 
                    'bg-blue-300 text-black'
                  }`}>
                    {q.importance} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- SECTION 6: DETAILED BREAKDOWNS (Preserving your original grids) --- */}
      
      {/* Sections Check */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 border-l-4 border-green-500 shadow-sm">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
            <h3 className="text-lg font-black text-gray-800 uppercase">Detected Sections</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.sections_detected.map((section, i) => (
              <span key={i} className="bg-green-200 text-green-900 px-3 py-1 text-sm font-bold border border-green-300">
                {section}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-red-50 p-4 border-l-4 border-red-500 shadow-sm">
          <div className="flex items-center mb-2">
            <XCircle className="w-6 h-6 mr-2 text-red-600" />
            <h3 className="text-lg font-black text-gray-800 uppercase">Missing Sections</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_sections.map((section, i) => (
              <span key={i} className="bg-red-200 text-red-900 px-3 py-1 text-sm font-bold border border-red-300">
                {section}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 border-l-4 border-blue-500 shadow-sm">
          <div className="flex items-center mb-2">
            <Briefcase className="w-6 h-6 mr-2 text-blue-600" />
            <h3 className="text-lg font-black text-gray-800 uppercase">Hard Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.hard_skills.map((skill, i) => (
              <span key={i} className="bg-blue-100 text-blue-900 px-3 py-1 text-sm font-bold border border-blue-200">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-purple-50 p-4 border-l-4 border-purple-500 shadow-sm">
          <div className="flex items-center mb-2">
            <Target className="w-6 h-6 mr-2 text-purple-600" />
            <h3 className="text-lg font-black text-gray-800 uppercase">Soft Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.soft_skills.map((skill, i) => (
              <span key={i} className="bg-purple-100 text-purple-900 px-3 py-1 text-sm font-bold border border-purple-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Issues */}
      {(formattingIssues.length > 0 || grammarIssues.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formattingIssues.length > 0 && (
            <div className="bg-orange-50 p-4 border-l-4 border-orange-500 shadow-sm">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
                <h3 className="text-lg font-black text-gray-800 uppercase">Formatting Issues</h3>
              </div>
              <ul className="list-disc pl-6 space-y-1">
                {formattingIssues.map((issue, i) => (
                  <li key={i} className="text-gray-800 font-medium">{issue}</li>
                ))}
              </ul>
            </div>
          )}
          {grammarIssues.length > 0 && (
            <div className="bg-pink-50 p-4 border-l-4 border-pink-500 shadow-sm">
              <div className="flex items-center mb-2">
                <FileText className="w-6 h-6 mr-2 text-pink-600" />
                <h3 className="text-lg font-black text-gray-800 uppercase">Grammar Issues</h3>
              </div>
              <ul className="list-disc pl-6 space-y-1">
                {grammarIssues.map((issue, i) => (
                  <li key={i} className="text-gray-800 font-medium">{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {keywords.length > 0 && (
          <div className="bg-indigo-50 p-4 border-l-4 border-indigo-500 shadow-sm">
            <div className="flex items-center mb-4">
              <Search className="w-6 h-6 mr-2 text-indigo-600" />
              <h3 className="text-lg font-black text-gray-800 uppercase">Keywords Found</h3>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              {keywords.map((keyword, i) => (
                <li key={i} className="text-gray-800 font-medium">{keyword}</li>
              ))}
            </ul>
          </div>
        )}
      {missingKeywords.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 border-l-4 border-gray-600 shadow-sm">
            <div className="flex items-center mb-4">
              <Search className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-black text-gray-800 dark:text-gray-200 uppercase">Missing Keywords</h3>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              {missingKeywords.map((keyword, i) => (
                <li key={i} className="text-gray-800 dark:text-gray-300 font-medium">{keyword}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {missingKeywords.length > 0 && (
        <h2 className="text-2xl font-black uppercase mt-8 mb-4 text-center">
          Bridge Your Skill Gaps
        </h2>
      )}
         <SkillGapLearner 
            missingSkills={missingKeywords}
            targetDomain={analysis.targetDomain || "General"}
         />

      {/* Bullet Improvements */}
      {analysis.bullet_improvements.length > 0 && (
        <div className="bg-blue-50 border-4 border-blue-600 p-6 shadow-md">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
            <h3 className="text-xl font-black text-blue-900 uppercase">Bullet Point Rewrites</h3>
          </div>
          <div className="space-y-4">
            {analysis.bullet_improvements.map((item, i) => (
              <div key={i} className="bg-white p-4 border-2 border-blue-100 shadow-sm">
                <div className="mb-2 pb-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Original</p>
                    <p className="text-red-800 line-through decoration-red-400 decoration-2">{item.original}</p>
                </div>
                <div className="mb-2">
                    <p className="text-xs text-blue-600 uppercase font-bold tracking-wider">Improved</p>
                    <p className="text-green-700 font-bold text-lg">{item.improved}</p>
                </div>
                <p className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-2">
                   "{item.reason}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SECTION 7: NEXT STEPS --- */}
      <section className="mt-8">
        <JobHunter 
          targetDomain={analysis.targetDomain || "General"} 
          keywords={analysis.hard_skills || []} 
        />
      </section>
    </div>
  );
};

export default AnalysisResults;