import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../src/supabaseClient'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const privateRoutes = ['/dashboard', '/agents'];
      const isPrivateRoute = privateRoutes.some(path => router.pathname.startsWith(path));

      if (isPrivateRoute) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/login');
          return;
        }
      }
      setCheckingAuth(false);
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const privateRoutes = ['/dashboard', '/agents'];
      const isPrivateRoute = privateRoutes.some(path => router.pathname.startsWith(path));
      if (isPrivateRoute && !session) {
        router.replace('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router.pathname]);

  const privateRoutes = ['/dashboard', '/agents'];
  const isPrivateRoute = privateRoutes.some(path => router.pathname.startsWith(path));

  // Render a clean loading state while verifying authorization on private routes
  if (isPrivateRoute && checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans">
        <div className="text-slate-400">Loading workspace...</div>
      </div>
    );
  }

  return <Component {...pageProps} />
}
