import React, { useState } from 'react';
import { Bird, Lock, Mail, ArrowLeft } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Create a mock user based on the email
      const mockUser: User = {
        name: email.split('@')[0], // Use part of email as name initially
        email: email,
        loftName: 'لوفت الأبطال',
        photoUrl: '' // Empty initially
      };
      
      onLogin(mockUser);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-fade-in border border-slate-100">
        <div className="bg-primary-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform rotate-12 scale-150 origin-top-left"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Bird className="text-primary-600 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">الزاجل برو</h1>
            <p className="text-primary-100 text-sm">رفيقك الذكي في عالم السباقات</p>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">تسجيل الدخول</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600 block">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-black bg-slate-50 transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600 block">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  required
                  className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-black bg-slate-50 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500" />
                <span className="text-slate-500">تذكرني</span>
              </label>
              <a href="#" className="text-primary-600 hover:underline">نسيت كلمة المرور؟</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>جاري الدخول...</>
              ) : (
                <>تسجيل الدخول <ArrowLeft size={20} /></>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              ليس لديك حساب؟ <a href="#" className="text-primary-600 font-bold hover:underline">أنشئ حساباً جديداً</a>
            </p>
          </div>
        </div>
      </div>
      
      <p className="fixed bottom-4 text-xs text-slate-400">جميع الحقوق محفوظة © 2025 الزاجل برو</p>
    </div>
  );
};

export default Login;