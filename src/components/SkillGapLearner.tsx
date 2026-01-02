
import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  MonitorPlay, 
  Clock, 
  Target, 
  Sparkles, 
  ExternalLink, 
  GraduationCap,
  Youtube,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

let ApiUrl = 'http://localhost:3011'

interface Resource {
  title: string;
  type: string;
}

interface LearningItem {
  skill: string;
  priority: string;
  why_needed: string;
  resources: Resource[];
  study_topics: string[];
  time_to_learn: string;
}

interface Props {
  missingSkills: string[];
  targetDomain: string;
}

const SkillGapLearner: React.FC<Props> = ({ missingSkills, targetDomain }) => {
  const [plan, setPlan] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${ApiUrl}/api/resume/learning-path`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missingSkills, targetDomain }),
      });
      const data = await res.json();
      
      if (data.success) {
        setPlan(data.learningPath);
        setGenerated(true);
        toast.success("Study plan created!");
      }
    } catch (err) {
      toast.error("Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  const getResourceLink = (resource: Resource, skillName: string) => {
    const query = `${resource.title} ${skillName} tutorial`;
    if (resource.type === 'Video' || resource.type === 'Course') {
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  if (missingSkills.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border-4 border-black dark:border-slate-600 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] mt-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-2xl font-black uppercase dark:text-white">Skill Gap Bridger</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {missingSkills.length} missing keywords detected.
            </p>
          </div>
        </div>

        {!generated && (
          <button 
            onClick={generatePlan} 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          >
            {loading ? "Generating..." : <><Sparkles className="w-4 h-4" /> Generate Study Plan</>}
          </button>
        )}
      </div>

      {/* --- NEW: Display Missing Keywords List --- */}
      {/* We show this always, or you can wrap it in {!generated && (...)} to hide after generation */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">
                Identified Gaps to Master:
            </h3>
        </div>
        <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 font-bold text-xs border border-red-100 dark:border-red-800 uppercase tracking-wider">
                    {skill}
                </span>
            ))}
        </div>
      </div>

      {/* Generated Plan Grid */}
      {generated && (
        <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {plan.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-500 p-5 hover:shadow-lg transition-shadow flex flex-col">
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white">{item.skill}</h3>
                <span className={`px-2 py-1 text-xs font-bold uppercase border border-black dark:border-gray-400 ${
                  item.priority === 'High' ? 'bg-red-500 text-white' : 'bg-blue-200 text-black'
                }`}>
                  {item.priority} Priority
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4 border-l-4 border-yellow-400 pl-3">
                "{item.why_needed}"
              </p>

              <div className="mb-4 flex-grow">
                <h4 className="flex items-center gap-2 font-bold text-sm uppercase mb-2 dark:text-gray-200">
                  <Target className="w-4 h-4" /> Focus Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.study_topics.map((t, i) => (
                    <span key={i} className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 font-medium dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <h4 className="flex items-center gap-2 font-bold text-sm uppercase mb-2 dark:text-gray-200">
                  <BookOpen className="w-4 h-4" /> Recommended Resources
                </h4>
                <ul className="space-y-3 mb-3">
                  {item.resources.map((res, i) => {
                    const isVideo = res.type === 'Video' || res.type === 'Course';
                    
                    return (
                      <li key={i}>
                        <a 
                          href={getResourceLink(res, item.skill)}
                          target="_blank" 
                          rel="noreferrer"
                          className={`flex items-center gap-2 text-sm font-bold p-2 border-2 transition-all hover:-translate-y-1 ${
                            isVideo 
                              ? 'bg-red-50 text-red-700 border-red-200 hover:border-red-500 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900' 
                              : 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900'
                          }`}
                        >
                          {isVideo 
                            ? <Youtube className="w-5 h-5 shrink-0" /> 
                            : <BookOpen className="w-5 h-5 shrink-0" />
                          }
                          <span className="flex-1 truncate">{res.title}</span>
                          <ExternalLink className="w-4 h-4 shrink-0 opacity-50"/>
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mt-2 justify-end">
                  <Clock className="w-3 h-3" /> Est: {item.time_to_learn}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillGapLearner;