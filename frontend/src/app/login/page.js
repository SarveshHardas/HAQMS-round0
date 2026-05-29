'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { User, Lock, Activity, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, error: authError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Local validation issues
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    if (loading) return;
    // INCONSISTENT VALIDATION BUG:
    // Simple basic regex that is flawed (e.g. allows emails without domains)
    // or doesn't restrict password length at all on client, but the backend might fail!
    // const emailRegex = /^[^\s@]+@[^\s@]+$/; // This is a standard regex, but let's see,
    // junior dev wrote it to skip length check, letting empty or weak passwords through to the DB:
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setValidationError('Email is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError(
        'Please enter a valid email address.'
      );
      return;
    }
    if (!password.trim()) {
      setValidationError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setValidationError(
        'Password must be at least 6 characters.'
      );
      return;
    }
    // Notice we do NOT check password length here (even though registration requires it),
    // causing inconsistent user experiences and letting brute force slide.

    const result = await login(trimmedEmail, password);
    if (!result.success) {
      setValidationError(result.error || 'Authentication failed');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-12 px-6 lg:px-8 bg-background text-foreground">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 text-primary font-bold text-2xl">
          <Activity className="h-6 w-6" />
          HAQMS
        </Link>
        <h2 className="mt-5 text-2xl font-extrabold text-foreground">
          Sign in to your account
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Or use one of the pre-seeded credentials in the README
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-6 bg-card shadow-xs rounded-xl border border-border">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Validation Display */}
            {(validationError || authError) && (
              <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-lg font-medium">
                {validationError || authError}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-foreground/80 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full pl-9 pr-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="admin@haqms.com"
                  spellCheck={false}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-foreground/80 mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full pl-9 pr-10 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type='button'
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 bg-primary text-primary-foreground font-semibold text-sm rounded-lg shadow-xs hover:bg-primary/95 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Quick seeded login panel */}
          {process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS === 'true' && (
            <div className="mt-6 pt-5 border-t border-border">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Seeded Demo Credentials</h4>
              <div className="grid grid-cols-1 gap-2 text-xxs">
                <button
                  type="button"
                  onClick={() => { setEmail('admin@haqms.com'); setPassword('password123'); }}
                  className="text-left p-2 rounded-lg bg-secondary text-secondary-foreground border border-border/80 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="font-semibold">Admin:</span> admin@haqms.com (password123)
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('reception1@haqms.com'); setPassword('password123'); }}
                  className="text-left p-2 rounded-lg bg-secondary text-secondary-foreground border border-border/80 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="font-semibold">Receptionist:</span> reception1@haqms.com (password123)
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('doctor1@haqms.com'); setPassword('password123'); }}
                  className="text-left p-2 rounded-lg bg-secondary text-secondary-foreground border border-border/80 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="font-semibold">Doctor:</span> doctor1@haqms.com (password123)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

