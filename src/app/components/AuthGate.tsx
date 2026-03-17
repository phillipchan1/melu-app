import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-5">
      <div className="w-full max-w-[375px] bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center text-center gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-[#E8E5E0] border-t-[#7C9E7A] animate-spin" />
        <div className="text-[22px] text-[#7C9E7A]" style={{ fontWeight: 600 }}>
          melu
        </div>
        <p className="text-[15px] text-[#78716C]" style={{ fontWeight: 400 }}>
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
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-5">
      <div className="w-full max-w-[375px] bg-white rounded-[28px] p-8 shadow-sm">
        <div className="text-[22px] text-[#7C9E7A] mb-6" style={{ fontWeight: 600 }}>
          melu
        </div>
        <h1 className="text-[28px] text-[#1C1917] mb-4" style={{ fontWeight: 600, lineHeight: 1.2 }}>
          Dinner plans, gated to your Google account.
        </h1>
        <p className="text-[15px] text-[#78716C] mb-8" style={{ fontWeight: 400, lineHeight: 1.6 }}>
          Sign in with Google to access Melu. That keeps each family&apos;s plan, profile,
          and future meal data tied to the right person.
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full h-[52px] bg-[#7C9E7A] rounded-full text-white text-[17px]"
          style={{ fontWeight: 600 }}
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

  useEffect(() => {
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

  if (loading) return <LoadingScreen />;
  if (!session?.user) return <SignInScreen />;

  return (
    <div>
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#E8E5E0]">
        <div className="max-w-[375px] mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[13px] text-[#1C1917] truncate" style={{ fontWeight: 600 }}>
              {session.user.user_metadata?.full_name ?? session.user.email}
            </div>
            <div className="text-[12px] text-[#78716C] truncate" style={{ fontWeight: 400 }}>
              {session.user.email}
            </div>
          </div>
          <button
            onClick={() => void supabase.auth.signOut()}
            className="text-[14px] text-[#7C9E7A]"
            style={{ fontWeight: 600 }}
          >
            Sign out
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
