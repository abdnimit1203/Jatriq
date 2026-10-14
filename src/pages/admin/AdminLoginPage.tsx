import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, Mail, AlertCircle, ArrowLeft, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Logo } from '../../components/Logo';

export const AdminLoginPage: React.FC = () => {
  const { login, loginWithGoogle, loginWithEmailPass, registerWithEmailPass } = useAdminAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    setIsSubmitting(false);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Google authentication failed.');
    }
  };

  // Email/Password or Demo submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = email.trim();
    const cleanPass = password.trim();

    if (!cleanInput || !cleanPass) {
      setError(
        language === 'bn'
          ? 'অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড উভয়টি প্রবেশ করান।'
          : 'Please enter both email/username and password.'
      );
      return;
    }

    // Check if user is using the demo shortcut
    if (cleanInput === 'admin' && cleanPass === 'admin') {
      if (import.meta.env.DEV) {
        const demoRes = login('admin', 'admin');
        if (demoRes.success) {
          navigate('/admin');
          return;
        }
      } else {
        setError(
          language === 'bn'
            ? 'ডেমো লগইন প্রোডাকশনে নিষ্ক্রিয়। দয়া করে অনুমোদিত অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন করুন।'
            : 'Demo login is disabled in production. Please sign in with an authorized Firebase admin account.'
        );
        return;
      }
    }

    setIsSubmitting(true);

    if (authMode === 'register') {
      const regRes = await registerWithEmailPass(cleanInput, cleanPass);
      setIsSubmitting(false);
      if (regRes.success) {
        navigate('/admin');
      } else {
        setError(regRes.error || 'Registration failed.');
      }
    } else {
      const loginRes = await loginWithEmailPass(cleanInput, cleanPass);
      setIsSubmitting(false);
      if (loginRes.success) {
        navigate('/admin');
      } else {
        setError(loginRes.error || 'Invalid credentials.');
      }
    }
  };

  const handleFillDemo = () => {
    setEmail('admin');
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
            {language === 'bn' ? 'অ্যাডমিন প্যানেল অথেন্টিকেশন' : 'Agency Administration Access'}
          </h2>
          <p className="mt-1.5 text-sm text-stone-600">
            {language === 'bn'
              ? 'নিরাপদ গুগল বা ইমেইল লগইন দিয়ে ড্যাশবোর্ড নিয়ন্ত্রণ করুন'
              : 'Secure Google Sign-In or Firebase Email authentication'}
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-stone-200/60 rounded-2xl border border-stone-200/90">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Google One-Click Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-700 font-semibold text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{language === 'bn' ? 'গুগল দিয়ে প্রবেশ করুন' : 'Sign in with Google'}</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-stone-500 font-semibold tracking-wider">
                {language === 'bn' ? 'অথবা ইমেইল / পাসওয়ার্ড' : 'Or continue with email'}
              </span>
            </div>
          </div>

          {/* 2. Email / Password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-stone-800 tracking-wide mb-1"
              >
                {language === 'bn' ? 'ইমেইল বা ইউজারনেম' : 'Email or Username'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={import.meta.env.DEV ? 'admin@jatriq.com or admin' : 'admin@jatriq.com'}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-stone-800 tracking-wide mb-1"
              >
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-300 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              {import.meta.env.DEV ? (
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-semibold transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ডেমো পূরণ করুন (Dev)' : 'Autofill demo (Dev)'}</span>
                </button>
              ) : (
                <span className="text-[11px] text-stone-400 font-mono">Whitelisted Access Only</span>
              )}

              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-xs text-stone-500 hover:text-stone-800 font-medium transition-colors cursor-pointer"
              >
                {authMode === 'login'
                  ? language === 'bn'
                    ? 'নতুন অ্যাকাউন্ট?'
                    : 'Need an account?'
                  : language === 'bn'
                  ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?'
                  : 'Already have account?'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>
                  {authMode === 'register'
                    ? language === 'bn'
                      ? 'অ্যাকাউন্ট তৈরি করুন'
                      : 'Create Admin Account'
                    : language === 'bn'
                    ? 'লগইন করুন'
                    : 'Sign in to Dashboard'}
                </span>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-stone-500">
          <span>{siteConfig.agencyName} &copy; {new Date().getFullYear()} &middot; {import.meta.env.DEV ? 'Firebase & Local Dev Authorized' : 'Protected Agency Portal'}</span>
        </div>
      </div>
    </div>
  );
};
