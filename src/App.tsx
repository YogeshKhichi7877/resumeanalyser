
import React, { useState , useEffect, Suspense } from 'react'; // Added Suspense
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { FileText, Zap, Moon, Sun, Wand2, Target, GitCompare as Compare , Lightbulb, Wrench, Cpu , PenTool, Sparkles,LogOut, Terminal} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// 1. Convert standard imports to React.lazy imports
const ResumeUploader = React.lazy(() => import('./components/ResumeUploader'));
const DomainSelector = React.lazy(() => import('./components/DomainSelector'));
const AnalysisResults = React.lazy(() => import('./components/AnalysisResults'));
const JDMatchResults = React.lazy(() => import('./components/JDMatchResults'));
const ResumeRewriter = React.lazy(() => import('./components/ResumeRewriter'));
const CoverLetterGenerator = React.lazy(() => import('./components/CoverLetterGenerator'));
const AIChatAssistant = React.lazy(() => import('./components/AIChatAssistant'));
const Footer = React.lazy(() => import('./components/Footer'));
const ResumeComparison = React.lazy(() => import('./components/ResumeComparison'));
const EnhancedResumeRewriter = React.lazy(() => import('./components/EnhancedResumeRewriter'));
const EnhancedCoverLetterGenerator = React.lazy(() => import('./components/EnhancedCoverLetterGenerator'));
const NotFound = React.lazy(()=> import('./components/NotFound'))

// Keep utility and type imports as standard imports (they are small/needed immediately)
import { exportAnalysisReport } from './utils/pdfExport';
import { 
  ResumeAnalysis, 
  UploadResponse, 
  JDMatchResult, 
  CoverLetter, 
  ChatMessage, 
  BulletImprovement,
} from './types/analysis';


// Dark mode context
const DarkModeContext = React.createContext({
  isDark: false,
  toggleDark: () => {}
});

let ApiUrl = 'http://localhost:3011'

// --- AUTH PAGE COMPONENT (Neobrutalist Style) ---
const AuthPage = ({ onLoginSuccess }: { onLoginSuccess: (token: string, userData: any) => void }) => {
    // ... (Your existing AuthPage logic here - no changes needed)
    const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Determine URL based on mode
      const url = isLogin 
        ? `${ApiUrl}/api/auth/login`
        : `${ApiUrl}/api/auth/register`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(isLogin ? 'Login Successful!' : 'Account Created!');
        // Pass the REAL token and user data to App
        onLoginSuccess(data.token, data); 
      } else {
        toast.error(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth Error:', error);
      toast.error('Server error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FDFD96] flex items-center justify-center p-4">
      <div className="w-full max-w-[500px]">
        <div className="flex mb-[-4px]">
          <button onClick={() => setIsLogin(true)} className={`px-8 py-3 font-black uppercase border-4 border-black transition-all ${isLogin ? 'bg-white z-10' : 'bg-gray-200 opacity-70'}`}>Login</button>
          <button onClick={() => setIsLogin(false)} className={`px-8 py-3 font-black uppercase border-4 border-l-0 border-black transition-all ${!isLogin ? 'bg-white z-10' : 'bg-gray-200 opacity-70'}`}>Register</button>
        </div>
        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-black uppercase">Name</label>
                <input type="text" required className="w-full p-4 border-4 border-black font-bold focus:bg-blue-50" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-black uppercase">Email</label>
              <input type="email" required className="w-full p-4 border-4 border-black font-bold focus:bg-blue-50" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-black uppercase">Password</label>
              <input type="password" required className="w-full p-4 border-4 border-black font-bold focus:bg-blue-50" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <button disabled={loading} type="submit" className="w-full py-4 bg-blue-600 text-white font-black text-xl border-4 border-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50">
              {loading ? 'Processing...' : (isLogin ? 'Enter App' : 'Join Now')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


// Assuming you have this context or pass these as props
interface NavigationProps {
  user?: { name: string; email: string };
  onLogout: () => void;
  isDark: boolean;
  toggleDark: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout, isDark, toggleDark }) => {
    // ... (Your existing Navigation logic here - no changes needed)
    const location = useLocation();

  const navItems = [
    { path: '/', label: 'Analyze', icon: FileText },
    { path: '/compare', label: 'Compare', icon: Compare },
    { path: '/tools', label: 'Tools', icon: Wand2 },
  ];

  return (
    <nav className={`w-full border-b-4 border-black sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-colors ${isDark ? 'bg-gray-900 border-white' : 'bg-white shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
      
      {/* Logo Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 group">
          <div className="bg-yellow-400 border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <Zap className="w-6 h-6 fill-black" />
          </div>
          <h1 className={`text-2xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>
            RESUME <span className="text-blue-600">PRO</span>
          </h1>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 py-2 border-2 border-black font-black uppercase text-xs transition-all
                  ${isActive 
                    ? 'bg-yellow-300 translate-x-[-2px] translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                    : `bg-white hover:bg-gray-50 ${isDark ? 'text-black' : ''}`
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Actions Section */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDark}
          className={`p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all ${isDark ? 'bg-gray-700 text-yellow-300' : 'bg-white text-gray-800'}`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-4 border-l-2 border-black">
          <div className="hidden sm:block text-right">
            <p className={`text-[10px] font-black uppercase leading-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Logged in as</p>
            <p className={`text-xs font-black truncate max-w-[100px] ${isDark ? 'text-white' : 'text-black'}`}>
              {user?.name || 'Guest'}
            </p>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const AnalyzePage = () => {
    // ... (Your existing AnalyzePage logic here - no changes needed)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('software-engineer');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [jdMatchResult, setJdMatchResult] = useState<JDMatchResult | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [bulletImprovements, setBulletImprovements] = useState<BulletImprovement[]>([]);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysis(null);
    setJdMatchResult(null);
  };

const handleAnalyze = async () => {
    if (!selectedFile) return;

    // 1. Check Login
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to analyze a resume.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('targetDomain', selectedDomain);

      // 2. Add User Details
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Send both ID formats to handle different Mongo versions/libraries
        formData.append('userId', user.id || user._id); 
        formData.append('userEmail', user.email);
      } else {
        throw new Error("User session invalid. Please relogin.");
      }

      // 3. Make the Request
      const response = await fetch(`${ApiUrl}/api/resume/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.results) {
            setAnalysis(data.results); 
        } else if (data.analysis) {
            // Fallback in case you revert server changes
            setAnalysis(data.analysis);
        }

        // Handle extracted text (if your server sends it back)
        // If server doesn't send 'extractedText', we default to empty string
        setExtractedText(data.extractedText || '');
        
        toast.success('Analysis Complete!');
      } else {
        // Handle specific server errors
        toast.error(data.error || 'Analysis failed.'); 
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Connection failed. Is the server running on port 3011?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJDMatch = async (jdText: string) => {
    if (!extractedText) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${ApiUrl}/api/resume/jd-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: extractedText,
          jobDescription: jdText,
          targetDomain: selectedDomain
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setJdMatchResult(data.matchResult);
      }
    } catch (error) {
      console.error('JD Match error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCoverLetterGenerate = async (tone: string, jobTitle: string, companyName: string) => {
    if (!extractedText) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${ApiUrl}/api/resume/cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: extractedText,
          jobTitle,
          companyName,
          tone
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setCoverLetter(data.coverLetter);
      }
    } catch (error) {
      console.error('Cover letter error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRewriteRequest = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${ApiUrl}/api/resume/rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulletText: text }),
      });
      
      const data = await response.json();
      if (data.success) {
        setBulletImprovements(prev => [...prev, data.improvement]);
      }
    } catch (error) {
      console.error('Rewrite error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {!analysis ? (
        <div className="material-grid">
          <div className="relative bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-500 p-8 md:p-12 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] mb-12 overflow-hidden">
      
      {/* Decorative Top Bar */}
      <div className="absolute top-0 left-0 w-full h-4 bg-purple-600 border-b-4 border-black dark:border-gray-500 flex items-center px-2 gap-2">
          <div className="w-2 h-2 rounded-full bg-black dark:bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-black dark:bg-white"></div>
          <div className="flex-1 text-xs font-mono font-bold text-white text-left pl-2"> SYSTEM.READY</div>
      </div>

      <div className="mt-6 relative z-10">
        {/* Main Headline with Highlight */}
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-8 leading-none">
          Resume Analysis & <br className="md:hidden" />
          {/* Highlighter effect */}
          <span className="relative inline-block px-4 py-1 ml-1 mt-2 md:mt-0 bg-yellow-400 dark:bg-purple-600 border-4 border-black dark:border-gray-200 text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transform -rotate-2">
            Optimization
          </span>
        </h1>

        {/* Subtitle broken into brutalist "tags" */}
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <Terminal className="w-6 h-6 text-black dark:text-white hidden md:block" />
          
          {[
            "Get professional feedback",
            "Optimize for ATS Bots",
            "Crush the competition"
          ].map((text, index) => (
            <div 
              key={index}
              className="
                bg-gray-100 dark:bg-gray-800 
                text-black dark:text-gray-200
                text-sm md:text-base font-bold uppercase tracking-wide
                px-4 py-2
                border-2 border-black dark:border-gray-400
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none
                transition-transform hover:-translate-y-1
                flex items-center gap-2
              "
            >
              {/* Small square decorative element */}
              <span className={`w-2 h-2 ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-purple-500' : 'bg-green-500' } border border-black`}></span>
              {text}
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[repeating-linear-gradient(45deg,#000,#000_2px,transparent_2px,transparent_10px)] dark:bg-[repeating-linear-gradient(45deg,#fff,#fff_2px,transparent_2px,transparent_10px)]"></div>
    </div>

          {/* Domain Selection */}
          <DomainSelector selectedDomain={selectedDomain} onDomainChange={setSelectedDomain} />

          {/* File Upload */}
          <ResumeUploader onFileSelect={handleFileSelect} isLoading={isLoading} />

          {/* Analyze Button */}
          {selectedFile && (
            <div className="material-card elevation-2 text-center">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="material-button ripple text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
              
              <div className="mt-4 text-gray-600">
                Selected: {selectedFile.name}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="material-grid">
          {/* Results Header */}
         <div className="space-y-8 mb-8">
  {/* 1. The Header with "Highlighter" effect */}
  <div className="text-center py-4">
    <h1 className="text-3xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter">
      Reviewed Resume for{' '}
      <span className="relative inline-block px-3 py-1 ml-1 transform -skew-x-3 bg-black dark:bg-white text-white dark:text-black border-2 border-transparent">
        {selectedDomain}
      </span>
    </h1>
  </div>

  {/* 2. Analysis Complete Card */}
  <div className="bg-green-400 dark:bg-green-600 border-4 border-black dark:border-white p-10 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] relative overflow-hidden">
    
    {/* Decorative Pattern Background */}
    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle,_black_1px,_transparent_1px)] bg-[length:20px_20px]"></div>

    <div className="relative z-10 flex flex-col items-center justify-center">
      <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white uppercase mb-8 tracking-tight drop-shadow-sm">
        Analysis Complete!
      </h2>
      
      <button
        onClick={() => {
          setAnalysis(null);
          setSelectedFile(null);
        }}
        className="
          group relative px-8 py-4 
          bg-white dark:bg-gray-900 
          text-black dark:text-white 
          font-black text-lg uppercase tracking-widest 
          border-4 border-black dark:border-white 
          shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] 
          transition-all duration-200
          hover:translate-y-[-4px] hover:translate-x-[-4px] 
          hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]
          active:translate-y-[0px] active:translate-x-[0px] 
          active:shadow-none
        "
      >
        <span className="flex items-center gap-2">
          Analyze Another Resume
          {/* Arrow Icon that moves on hover */}
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</div>

          {/* Score Display */}
          <AnalysisResults analysis={analysis} extractedText={extractedText} />
          
          {/* JD Match */}
          <JDMatchResults 
            onJDUpload={handleJDMatch}
            // matchResult={jdMatchResult}
            isLoading={isLoading}
          />
          
          {/* Resume Rewriter */}
          <ResumeRewriter 
            improvements={bulletImprovements}
            onRewriteRequest={handleRewriteRequest}
            isLoading={isLoading}
          />

          {/* Cover Letter Generator */}
          <CoverLetterGenerator 
            onGenerate={handleCoverLetterGenerate}
            // coverLetter={coverLetter}
            isLoading={isLoading}
          />
     
        {analysis.improvements.length > 0 && (
          <div className="bg-orange-50 dark:bg-orange-950/30 border-4 border-black dark:border-orange-500 p-6 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] dark:shadow-none h-full">
            <div className="flex items-center gap-3 mb-6 border-b-4 border-black dark:border-orange-500 pb-4">
              <Lightbulb className="w-8 h-8 text-orange-600 dark:text-orange-400 fill-current" />
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                Optimization Strategy
              </h3>
            </div>
            
            <div className="space-y-4">
              {analysis.improvements.map((tip, index) => (
                <div key={index} className="flex gap-4 bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-900 p-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 bg-orange-500 text-white font-black text-sm border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
                    {index + 1}
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium text-sm leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Executive Summary (Blue Theme) */}
        {analysis.summary && (
          <div className="bg-blue-50 dark:bg-blue-950/30 border-4 border-black dark:border-blue-500 p-6 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] dark:shadow-none h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b-4 border-black dark:border-blue-500 pb-4">
              <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
               Summary
              </h3>
            </div>
            
            <div className="flex-grow bg-white dark:bg-gray-800 border-2 border-black dark:border-blue-400 p-6 relative">
              {/* Decorative Quote Icon */}
              <span className="absolute -top-4 -left-2 text-6xl text-blue-200 dark:text-blue-900 font-serif leading-none select-none">
                "
              </span>
              
              <p className="relative z-10 text-lg text-gray-800 dark:text-gray-200 font-medium leading-loose italic">
                {analysis.summary}
              </p>
              
              <div className="mt-6 flex items-center gap-2">
                <div className="h-1 flex-grow bg-blue-100 dark:bg-blue-900 rounded-full"></div>
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                 That's all folks!
                </span>
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

const ToolsPage = () => {
    // ... (Your existing ToolsPage logic here - no changes needed)
    const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bulletImprovements, setBulletImprovements] = useState<BulletImprovement[]>([]);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [rewrittenResume, setRewrittenResume] = useState<any>(null);
  
  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${ApiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          resumeContext: '',
          targetDomain: 'software-engineer',
          conversationHistory: messages.slice(-5)
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // const handleRewriteRequest = async (text: string) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch('http://localhost:3011/api/resume/rewrite', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ bulletText: text }),
  //     });
      
  //     const data = await response.json();
  //     if (data.success) {
  //       setBulletImprovements(prev => [...prev, data.improvement]);
  //     }
  //   } catch (error) {
  //     console.error('Rewrite error:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
 
  const handleEnhancedRewrite = async (resumeText: string, tone: string, targetRole: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${ApiUrl}/api/resume/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, tone, targetRole }),
      });
      
      const data = await response.json();
      if (data.success) {
        setRewrittenResume(data.enhancedResume);
      }
    } catch (error) {
      console.error('Enhanced rewrite error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEnhancedCoverLetter = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${ApiUrl}/api/resume/cover-letter-enhanced`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      if (result.success) {
        setCoverLetter(result.coverLetter);
      }
    } catch (error) {
      console.error('Enhanced cover letter error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      
      {/* Neo-Brutalist Header */}
      <div className="bg-yellow-400 dark:bg-yellow-600 border-4 border-black dark:border-white p-8 mb-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.5)] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wrench className="w-64 h-64 text-black dark:text-white" />
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-black dark:bg-white text-white dark:text-black p-3 border-2 border-transparent">
                    <Cpu className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white">
                AI Workshop
                </h1>
            </div>
            <p className="text-xl md:text-2xl font-bold border-l-8 border-black dark:border-white pl-4 text-black dark:text-white">
                Enhance <span className="text-white dark:text-black bg-black dark:bg-white px-2">Generate</span> Optimize • Excel
            </p>
        </div>
      </div>
      
      {/* Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Resume Rewriter Section */}
        <div className="flex flex-col h-full">
            <div className="mb-2 flex items-center gap-2">
                <PenTool className="w-6 h-6" />
                <h2 className="text-xl font-black uppercase">Resume Refiner</h2>
            </div>
            <EnhancedResumeRewriter 
            onRewrite={handleEnhancedRewrite}
            rewrittenResume={rewrittenResume}
            isLoading={isLoading}
            />
        </div>
        
        {/* Cover Letter Generator Section */}
        <div className="flex flex-col h-full">
            <div className="mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-xl font-black uppercase">Letter Crafter</h2>
            </div>
            <EnhancedCoverLetterGenerator 
            onGenerate={handleEnhancedCoverLetter}
            // coverLetter={coverLetter} // Ensure your component accepts this prop if you uncomment it
            isLoading={isLoading}
            />
        </div>
        
          <AIChatAssistant 
            onSendMessage={handleSendMessage}
            messages={messages}
            isLoading={isLoading}
            resumeContext=""
            targetDomain="software-engineer"
          />
        </div>
      </div>
  );
};

function App() {
  // 1. Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 2. UI & Chat State
  const [isDark, setIsDark] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check for session on startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const toggleDark = () => setIsDark(!isDark);

  const handleLoginSuccess = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    toast.success(`Welcome, ${userData.name}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${ApiUrl}/api/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Pass token to AI
        },
        body: JSON.stringify({
          message,
          resumeContext: '',
          targetDomain: 'software-engineer',
          conversationHistory: messages.slice(-5)
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("Failed to reach AI Assistant");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. AUTH GUARD: Show Login/Register if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <AuthPage onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" />
      </>
    );
  }

  // 4. MAIN APP: Show this only when logged in
  return (
    <DarkModeContext.Provider value={{ isDark, toggleDark }}>
      <Router>
        <div className={`min-h-screen material-transition ${
          isDark ? 'bg-gray-900 text-white' : 'bg-[#FDFD96]'
        }`}>
          {/* Pass user and logout to Navigation */}
          <Navigation 
            user={user} 
            onLogout={handleLogout} 
            isDark={isDark} 
            toggleDark={toggleDark} 
          />
          
          <main className="w-full max-w-[1400px] mx-auto">
             {/* 2. Wrap Routes in Suspense with a loading fallback */}
            <Suspense fallback={
                <div className="flex h-[50vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-8 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xl font-black uppercase animate-pulse">Loading Module...</p>
                    </div>
                </div>
            }>
                <Routes>
                <Route path="/" element={<AnalyzePage />} />
                <Route path="/compare" element={<ResumeComparison />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="*" element={<NotFound/>} />
                </Routes>
            </Suspense>
          </main>
          
          <Suspense fallback={null}>
            <AIChatAssistant 
                onSendMessage={handleSendMessage}
                messages={messages}
                isLoading={isLoading}
                resumeContext=""
                targetDomain="software-engineer"
            />
          </Suspense>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                border: '4px solid black',
                borderRadius: '0px',
                background: '#fff',
                color: '#000',
                fontWeight: 'bold',
              }
            }}
          />
        </div>
        <Suspense fallback={<div className="h-20 bg-gray-100 dark:bg-gray-800 animate-pulse mt-20"></div>}>
             <Footer />
        </Suspense>
      </Router>
    </DarkModeContext.Provider>
  );
}

export default App;