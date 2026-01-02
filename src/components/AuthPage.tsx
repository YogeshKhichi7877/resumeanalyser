import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? "Logging in..." : "Registering...", formData);
    // Add your API call here
  };

  return (
    <div className="min-h-screen w-full bg-[#FDFD96] flex items-center justify-center p-4">
      <div className="w-full max-w-[500px]">
        {/* Header Toggle */}
        <div className="flex mb-[-4px]">
          <button 
            onClick={() => setIsLogin(true)}
            className={`px-8 py-3 font-black uppercase border-4 border-black transition-all ${isLogin ? 'bg-white translate-y-0 z-10' : 'bg-gray-200 translate-y-1 opacity-70'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`px-8 py-3 font-black uppercase border-4 border-l-0 border-black transition-all ${!isLogin ? 'bg-white translate-y-0 z-10' : 'bg-gray-200 translate-y-1 opacity-70'}`}
          >
            Register
          </button>
        </div>

        {/* Main Form Card */}
        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative z-0">
          <div className="mb-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="font-bold text-gray-600 uppercase text-sm mt-2">
              {isLogin ? 'Access your resume reports' : 'Start analyzing your career'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-black uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-4 w-5 h-5" />
                  <input
                    type="text"
                    required
                    placeholder="Yogesh Khinhi"
                    className="w-full p-4 pl-12 border-4 border-black font-bold focus:outline-none focus:bg-blue-50"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-black uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-5 h-5" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full p-4 pl-12 border-4 border-black font-bold focus:outline-none focus:bg-blue-50"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-black uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 w-5 h-5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full p-4 pl-12 border-4 border-black font-bold focus:outline-none focus:bg-blue-50"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-black text-xl border-4 border-black uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              {isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              {isLogin ? 'Enter App' : 'Join Now'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-4 border-black text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-black uppercase text-sm hover:underline flex items-center justify-center mx-auto gap-2"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;