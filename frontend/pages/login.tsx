import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Terminal, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { supabase } from '../src/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields to sign in.');
      return;
    }
    
    setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName || !fullName.trim() || !phone || !phone.trim() || !signupEmail || !signupPassword || !confirmPassword) {
      setError('Please fill in all fields to create an account.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Sign In - Born AI' : 'Create Account - Born AI'}</title>
      </Head>
      
      <div className="min-h-screen bg-slate-950 flex font-sans selection:bg-purple-500/30">
        
        {/* LEFT COLUMN: 60% Cinematic Animation */}
        <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden bg-slate-950 border-r border-white/10 items-center justify-center p-12">
          {/* Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-[100px] pointer-events-none" />
          
          {/* Animated Particles/Nodes */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: ['-100%', '100%'],
                  opacity: [0, 0.5, 0],
                  scale: [1, 2, 1]
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
                className="absolute w-1 h-20 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-20%'
                }}
              />
            ))}
          </div>

          <div className="relative z-10 w-full max-w-xl">
            <Link href="/" className="inline-flex items-center gap-2 mb-16 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] transition-all">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">Born AI</span>
            </Link>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight"
            >
              The Enterprise OS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">for AI Agents.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-400 font-light mb-12"
            >
              Deploy autonomous agents that connect to your knowledge base, long-term memory, and deployment channels instantly.
            </motion.p>

            {/* Cinematic Floating Code Block */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <div className="ml-2 text-xs text-slate-500 font-mono">agent-deploy.ts</div>
              </div>
              <pre className="text-sm font-mono text-slate-300 leading-relaxed overflow-x-hidden">
                <code className="text-purple-400">import</code> {'{ Agent, Memory }'} <code className="text-purple-400">from</code> <span className="text-green-300">'@born-ai/sdk'</span>;<br/><br/>
                <code className="text-blue-400">const</code> agent = <code className="text-purple-400">new</code> Agent({'{'}<br/>
                {'  '}name: <span className="text-green-300">'SalesOS'</span>,<br/>
                {'  '}memory: Memory.<span className="text-blue-300">LongTerm</span>(),<br/>
                {'  '}channels: [<span className="text-green-300">'whatsapp'</span>, <span className="text-green-300">'web'</span>]<br/>
                {'}'});<br/><br/>
                <code className="text-blue-400">await</code> agent.<span className="text-blue-300">deploy</span>();
              </pre>
              <motion.div 
                animate={{ left: ['-10%', '110%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
              />
            </motion.div>
          </div>
        </div>

        {/* RIGHT COLUMN: 40% Auth Forms */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-16 py-12 relative">
          
          <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-white transition-colors inline-flex items-center text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>

          <div className="w-full max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {isLogin ? (
                // --- LOGIN VIEW ---
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-slate-400 mb-6">Sign in to manage your AI workforce.</p>

                  <AnimatePresence>
                    {error && isLogin && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    <Button onClick={() => router.push('/dashboard')} type="button" variant="outline" className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium">
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Continue with Google
                    </Button>
                    <Button onClick={() => router.push('/dashboard')} type="button" variant="outline" className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium">
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      Continue with GitHub
                    </Button>
                  </div>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-950 text-slate-500">Or continue with email</span>
                    </div>
                  </div>

                  <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleLogin(e as any); }}>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email ID</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} type="email" className="block w-full pl-11 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all" placeholder="name@company.com" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-300">Password</label>
                        <a href="#" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">Forgot Password?</a>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} type={showPassword ? "text" : "password"} className="block w-full pl-11 pr-12 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all" placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors">
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button disabled={isLoading} type="submit" size="lg" className="w-full h-12 bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>

                  <p className="mt-8 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <button onClick={() => { setIsLogin(false); setError(null); }} className="font-semibold text-white hover:text-purple-400 transition-colors">
                      Sign Up
                    </button>
                  </p>
                </motion.div>
              ) : (
                // --- SIGN UP VIEW ---
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                  <p className="text-slate-400 mb-6">Build and deploy enterprise AI agents.</p>

                  <AnimatePresence>
                    {error && !isLogin && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSignup(e as any); }}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                          </div>
                          <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all" placeholder="John Doe" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                          </div>
                          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all" placeholder="+1 (555)" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email ID</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} type="email" className="block w-full pl-11 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all" placeholder="name@company.com" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} type={showPassword ? "text" : "password"} className="block w-full pl-11 pr-12 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all" placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors">
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={showConfirmPassword ? "text" : "password"} className="block w-full pl-11 pr-12 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all" placeholder="••••••••" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors">
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button disabled={isLoading} type="submit" size="lg" className="w-full h-12 bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>

                  <p className="mt-8 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <button onClick={() => { setIsLogin(true); setError(null); }} className="font-semibold text-white hover:text-purple-400 transition-colors">
                      Sign In
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </>
  );
}
