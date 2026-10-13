import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, User, AlertCircle, ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = login(username, password);
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
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'মূল ওয়েবসাইটে ফিরে যান' : 'Back to Public Website'}</span>
          </Link>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-serif italic font-extrabold text-emerald-800 text-3xl">J</span>
            <span className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {siteConfig.agencyName}
            </span>
          </div>

          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            {language === 'bn' ? 'অ্যাডমিন প্যানেল লগইন' : 'Agency Administration Panel'}
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            {language === 'bn'
              ? 'ট্যুর প্যাকেজ ব্যবস্থাপনা ও কনফিগারেশন ডেমো'
              : 'Package management & JSON import/export demo'}
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Security Limitation Disclaimer Banner */}
        <div className="mb-4 bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block uppercase tracking-wider text-[11px] text-amber-800 font-mono">
              DEMO ONLY / ডেমো অ্যাডমিন
            </span>
            <p className="leading-relaxed text-[11px] text-amber-800/90">
              {language === 'bn'
                ? 'এটি ক্লায়েন্ট-সাইড ডেমো। প্রদর্শনীর জন্য ইউজারনেম "admin" এবং পাসওয়ার্ড "admin" ব্যবহার করুন।'
                : 'This is a frontend demonstration. For evaluation, use username "admin" and password "admin". Client-side guards are not production authentication.'}
            </p>
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-stone-200/90 sm:px-10">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1"
              >
                {language === 'bn' ? 'ইউজারনেম' : 'Username'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1"
              >
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-medium"
              >
                <KeyRound className="w-3 h-3" />
                <span>{language === 'bn' ? 'ডেমো কোড পূরণ করুন' : 'Auto-fill demo credentials'}</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm transition-colors shadow-xs cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700"
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
