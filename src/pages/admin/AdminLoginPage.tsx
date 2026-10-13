import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, User, AlertCircle, ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Logo } from '../../components/Logo';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Keep fields empty by default - do NOT pre-fill credentials (user request)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError(
        language === 'bn'
          ? 'অনুগ্রহ করে ইউজারনেম ও পাসওয়ার্ড উভয়টি প্রবেশ করান।'
          : 'Please enter both username and password.'
      );
      return;
    }
    const result = login(username.trim(), password.trim());
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Authentication failed.');
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin');
    setError('');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-stone-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'মূল ওয়েবসাইটে ফিরে যান' : 'Back to Public Website'}</span>
          </Link>

          <div className="flex justify-center mb-3">
            <Link to="/">
              <Logo size="lg" variant="dark" showTagline={false} />
            </Link>
          </div>

          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            {language === 'bn' ? 'অ্যাডমিন প্যানেল লগইন' : 'Agency Administration Panel'}
          </h2>
          <p className="mt-1.5 text-sm text-stone-600">
            {language === 'bn'
              ? 'ট্যুর প্যাকেজ ব্যবস্থাপনা ও JSON ডেটা কন্ট্রোল ডেমো'
              : 'Package management & JSON import/export demo'}
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Security Limitation & Demo Credentials Hint Box */}
        <div className="mb-5 bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 text-sm text-amber-950 shadow-xs flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-xs text-amber-900 font-mono">
                DEMO CREDENTIALS / ডেমো তথ্য
              </span>
              <span className="text-[11px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md font-semibold">
                Demo Only
              </span>
            </div>
            <p className="leading-relaxed text-xs sm:text-sm text-amber-900/95">
              {language === 'bn'
                ? 'এটি একটি ফ্রন্টএন্ড ডেমো। লগইন করতে নিচের তথ্যগুলো ব্যবহার করুন:'
                : 'This is a frontend demonstration. Enter the demo credentials below to evaluate:'}
            </p>
            {/* Clear Credential Hints */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                <span className="text-[10px] uppercase text-amber-700 block font-sans font-semibold">Username hint:</span>
                <span className="font-bold text-stone-900">admin</span>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                <span className="text-[10px] uppercase text-amber-700 block font-sans font-semibold">Password hint:</span>
                <span className="font-bold text-stone-900">admin</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-stone-200/60 rounded-2xl border border-stone-200/90">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-sm font-bold text-stone-800 tracking-wide mb-1.5"
              >
                {language === 'bn' ? 'ইউজারনেম' : 'Username'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: admin' : 'Hint: admin'}
                  className="w-full pl-11 pr-4 py-3 text-base rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-bold text-stone-800 tracking-wide mb-1.5"
              >
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: admin' : 'Hint: admin'}
                  className="w-full pl-11 pr-4 py-3 text-base rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-800 hover:text-emerald-950 font-semibold transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>{language === 'bn' ? 'ডেমো কোড পূরণ করুন' : 'Click to autofill demo'}</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-base transition-all shadow-md hover:shadow-lg cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              {language === 'bn' ? 'লগইন করুন' : 'Sign in to Dashboard'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-stone-500">
          <span>{siteConfig.agencyName} &copy; {new Date().getFullYear()} &middot; Demo Management</span>
        </div>
      </div>
    </div>
  );
};
