import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { useStore } from '../lib/store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsGuest } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // If Supabase is not configured with real keys, automatically log in gracefully as guest
    if (!isSupabaseConfigured || !supabase) {
      setTimeout(() => {
        loginAsGuest();
        navigate('/');
      }, 500);
      return;
    }

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Account created! Please check your email to verify your address.',
        });
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        navigate('/');
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Password reset link sent to your email.',
        });
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Authentication error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-dark-border shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy mx-auto flex items-center justify-center shadow-lg">
            <img src="/favicon.svg" alt="Mihiracle Logo" className="w-9 h-9" />
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white tracking-tight">
            Mihiracle
          </h1>
          <p className="text-xs text-brand-muted dark:text-dark-muted">
            A little learning. Every day.
          </p>
        </div>

        {/* Demo Mode / Quick Exploration Callout */}
        <div className="p-3.5 bg-brand-mint/20 dark:bg-brand-mint/10 border border-brand-mint/50 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-700 dark:text-brand-mint shrink-0" />
            <span className="text-brand-navy dark:text-brand-mint font-medium">
              Want to explore first without signing up?
            </span>
          </div>
          <button
            type="button"
            onClick={handleGuestLogin}
            className="px-2.5 py-1 bg-brand-navy text-white dark:bg-brand-mint dark:text-brand-navy font-bold rounded-lg shrink-0 cursor-pointer shadow-2xs hover:opacity-90 transition-opacity"
          >
            Guest Access
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex rounded-xl bg-stone-100 dark:bg-dark-card p-1">
          <button
            type="button"
            onClick={() => { setMode('login'); setMessage(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'login' 
                ? 'bg-white dark:bg-dark-surface text-brand-text dark:text-dark-text shadow-xs' 
                : 'text-brand-muted dark:text-dark-muted hover:text-brand-text'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setMessage(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'register' 
                ? 'bg-white dark:bg-dark-surface text-brand-text dark:text-dark-text shadow-xs' 
                : 'text-brand-muted dark:text-dark-muted hover:text-brand-text'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Message */}
        {message && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
          }`}>
            {message.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-brand-text dark:text-dark-text block mb-1">
                Your Full Name
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mihir"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-brand-text dark:text-dark-text block mb-1">
              Email Address
            </label>
            <Input
              type="email"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-brand-text dark:text-dark-text">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-brand-muted hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <Input
                type="password"
                icon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full py-3 text-sm font-bold shadow-sm"
          >
            {mode === 'login' && 'Sign In to Mihiracle'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Send Reset Link'}
          </Button>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-brand-muted hover:underline mt-2 cursor-pointer"
            >
              Back to Sign In
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
