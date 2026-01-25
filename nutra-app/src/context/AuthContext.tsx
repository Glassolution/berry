import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session) console.log('Session exists on init');
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Deep Link Listener for OAuth
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      console.log('callback url:', url);
      
      if (url.includes('auth/callback')) {
        // Extract 'code' or 'access_token'/'refresh_token'
        // Handle PKCE flow (code)
        // Parse URL parameters safely
        let params: URLSearchParams;
        if (url.includes('?')) {
          params = new URLSearchParams(url.split('?')[1]);
        } else if (url.includes('#')) {
             params = new URLSearchParams(url.split('#')[1]);
        } else {
            return;
        }

        const code = params.get('code');

        if (code) {
          supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
            if (error) {
              console.error('Error exchanging code:', error);
            } else if (data.session) {
              console.log('Google login success');
              // onAuthStateChange will handle the state update
            }
          });
        } else {
          // Fallback for Implicit flow (hash)
          // Usually hash is already handled by splitting logic above if we treat it uniformly, 
          // but let's be specific for legacy hash flow if needed.
          // However, Supabase often puts everything in hash for implicit.
          
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            }).then(({ data, error }) => {
              if (error) {
                console.error('Error setting session:', error);
              } else if (data.session) {
                console.log('Google login success');
              }
            });
          }
        }
      }
    };

    const sub = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.unsubscribe();
      sub.remove();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

