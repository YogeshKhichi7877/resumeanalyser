
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Briefcase, ChevronDown, AlertTriangle } from 'lucide-react';
import { ChatMessage } from '../types/analysis';

interface AIChatAssistantProps {
  onSendMessage: (message: string) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  // resumeContext prop kept for compatibility but ignored in UI to emphasize general nature
  resumeContext?: string; 
  targetDomain?: string;
  onDomainChange?: (domain: string) => void;
}

const DOMAINS = [
  "General",
  "Software Engineering",
  "Product Management",
  "Data Science",
  "UI/UX Design",
  "Marketing & Sales",
  "Finance & Accounting",
  "Human Resources"
];

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ 
  onSendMessage, 
  messages, 
  isLoading,
  targetDomain = "General",
  onDomainChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(targetDomain);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDomainSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDomain = e.target.value;
    setSelectedDomain(newDomain);
    if (onDomainChange) {
      onDomainChange(newDomain);
    }
  };

  // Updated to be General Questions instead of Personal Analysis
  const quickQuestions = [
    `What are top skills for ${selectedDomain}?`,
    `Common mistakes in ${selectedDomain} resumes?`,
    "What is the best resume layout?",
    "How to write a strong summary?",
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-purple-600 text-white border-4 border-black dark:border-white
            shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] 
            hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]
            hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200
            flex items-center justify-center group"
        >
          <Bot className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[650px] bg-white dark:bg-gray-800 border-4 border-black dark:border-gray-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] z-50 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
      
      {/* --- HEADER --- */}
      <div className="bg-purple-600 p-4 border-b-4 border-black dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white border-2 border-black p-1 mr-3">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase leading-none tracking-tight">AI Strategy</h3>
            <span className="text-[10px] font-bold text-purple-200 uppercase tracking-widest">General Guide</span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="bg-red-500 hover:bg-red-600 text-white border-2 border-black p-1 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* --- IMPORTANT NOTICE --- */}
      <div className="bg-orange-400 p-3 border-b-4 border-black dark:border-gray-600 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-black shrink-0 mt-0.5" />
        <p className="text-xs font-black text-black leading-tight uppercase">
          Notice: I provide general advice only. I do not see or analyze your uploaded resume file directly.
        </p>
      </div>

      {/* --- DOMAIN SELECTOR BAR --- */}
      <div className="bg-yellow-400 dark:bg-yellow-600 p-3 border-b-4 border-black dark:border-gray-600 flex items-center justify-between gap-2">
        <div className="flex items-center text-black dark:text-white font-bold text-xs uppercase">
            <Briefcase className="w-4 h-4 mr-2" />
            Context:
        </div>
        <div className="relative flex-1">
            <select 
                value={selectedDomain}
                onChange={handleDomainSelect}
                className="w-full appearance-none bg-white dark:bg-gray-700 text-black dark:text-white text-xs font-bold border-2 border-black dark:border-gray-500 py-2 pl-3 pr-8 focus:outline-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
            >
                {DOMAINS.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-black dark:text-white" />
        </div>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 border-2 border-black dark:border-gray-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              <div className="flex items-start">
                <Bot className="w-6 h-6 mr-3 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-black dark:text-white font-bold text-sm">
                    Ask me anything about <span className="bg-yellow-300 dark:bg-yellow-600 px-1 border border-black dark:border-transparent text-black">{selectedDomain}</span> industry standards.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    I can help with best practices, keyword trends, and formatting tips.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">General Topics</p>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMessage(question);
                  }}
                  className="w-full text-left p-2 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-500 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  ➜ {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat History */}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 border-2 border-black dark:border-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] ${
              message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white dark:bg-gray-800 text-black dark:text-gray-200'
            }`}>
              <div className="flex items-start gap-2">
                {message.role === 'assistant' && <Bot className="w-4 h-4 mt-0.5" />}
                <div className="text-sm font-bold whitespace-pre-wrap leading-relaxed">{message.content}</div>
                {message.role === 'user' && <User className="w-4 h-4 mt-0.5" />}
              </div>
            </div>
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="bg-white dark:bg-gray-800 p-3 border-2 border-black dark:border-gray-500">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-black dark:bg-white animate-bounce"></div>
                <div className="w-2 h-2 bg-black dark:bg-white animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-black dark:bg-white animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-4 border-t-4 border-black dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your general question..."
            className="flex-1 p-3 text-sm font-bold border-2 border-black dark:border-gray-500 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transition-shadow resize-none dark:text-white"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 bg-green-500 hover:bg-green-600 text-white border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatAssistant;