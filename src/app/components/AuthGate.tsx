import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfig } from '../lib/supabase';

function SetupScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-page">
      <div className="w-full max-w-[375px] bg-card rounded-[28px] p-8 shadow-sm">
        <div className="text-[22px] text-primary font-semibold mb-6">
          melu
        </div>
        <h1 className="text-[28px] text-foreground mb-4 font-semibold leading-[1.2]">
          Supabase not configured
        </h1>
        <p className="text-[15px] text-muted-foreground mb-6 font-normal leading-[1.6]">
          Copy <code className="bg-secondary px-1 rounded">.env.example</code> to{' '}
          <code className="bg-secondary px-1 rounded">.env</code> and set{' '}
          <code className="bg-secondary px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
          <code className="bg-secondary px-1 rounded">VITE_SUPABASE_ANON_KEY</code>.
        </p>
        <p className="text-[13px] text-muted-foreground font-normal">
          Restart the dev server after creating <code className="bg-secondary px-1 rounded">.env</code>.
        </p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-page">
      <div className="w-full max-w-[375px] bg-card rounded-3xl p-8 shadow-sm flex flex-col items-center text-center gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-border border-t-primary animate-spin" />
        <div className="text-[22px] text-primary font-semibold">
          melu
        </div>
        <p className="text-[15px] text-muted-foreground font-normal">
          Checking your session…
        </p>
      </div>
    </div>
  );
}

function SignInScreen() {
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Google sign-in failed', error);
      window.alert('Google sign-in failed. Check Supabase auth config and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-page">
      <div className="w-full max-w-[375px] bg-card rounded-[28px] p-8 shadow-sm">
        <div className="text-[22px] text-primary font-semibold mb-6">
          melu
        </div>
        <h1 className="text-[28px] text-foreground mb-4 font-semibold leading-[1.2]">
          Meal planning for your family.
        </h1>
        <p className="text-[15px] text-muted-foreground mb-8 font-normal leading-[1.6]">
          Sign in to get started. Your plan and preferences stay tied to your
          account.
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full h-[52px] bg-primary rounded-full text-primary-foreground text-[17px] font-semibold"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // After OAuth redirect, clear auth hash and go to splash
  useEffect(() => {
    if (!session?.user) return;
    const hasAuthCallback = /access_token|refresh_token/.test(
      location.hash + location.search
    );
    if (hasAuthCallback) {
      window.history.replaceState(null, '', window.location.pathname || '/');
      navigate('/', { replace: true });
    }
  }, [session, location.hash, location.search, navigate]);

  useEffect(() => {
    if (!supabaseConfig.isConfigured || !supabase) return;
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Failed to load session', error);
      }
      setSession(data.session ?? null);
      setLoading(false);
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!supabaseConfig.isConfigured) return <SetupScreen />;
  if (loading) return <LoadingScreen />;
  if (!session?.user) return <SignInScreen />;

  const hideSessionHeader =
    location.pathname === "/home" ||
    location.pathname === "/plan" ||
    location.pathname === "/profile" ||
    location.pathname === "/melu-snapshot" ||
    location.pathname === "/weekly-checkin" ||
    location.pathname === "/weekly-checkin/context";

  if (hideSessionHeader) {
    return <>{children}</>;
  }

  return (
    <div>
      <div className="sticky top-0 z-50 bg-card/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-[375px] mx-auto px-page py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[13px] text-foreground truncate font-semibold">
              {session.user.user_metadata?.full_name ?? session.user.email}
            </div>
            <div className="text-[12px] text-muted-foreground truncate font-normal">
              {session.user.email}
            </div>
          </div>
          <button
            onClick={() => void supabase.auth.signOut()}
            className="text-[14px] text-primary font-semibold"
          >
            Sign out
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
