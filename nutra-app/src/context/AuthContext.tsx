import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isSigningOut: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isSigningOut: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const isSigningOutRef = useRef(false);

  const setSigningOut = (value: boolean) => {
    isSigningOutRef.current = value;
    setIsSigningOut(value);
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session) console.log('Session exists on init');
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth state changed: ${event}`, session?.user?.id);
      
      if (isSigningOutRef.current) {
        console.log('Ignorando atualização de sessão pois estamos fazendo logout.');
        return;
      }

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

  const signOut = async () => {
    try {
      console.log('Iniciando processo de signOut...');
      setSigningOut(true);
      await supabase.auth.signOut({ scope: 'local' });

      // Forçar limpeza manual do AsyncStorage para garantir
      const keys = await AsyncStorage.getAllKeys();
      const supabaseKeys = keys.filter(k => k.includes('supabase') || k.includes('sb-'));
      if (supabaseKeys.length > 0) {
        console.log('Removendo chaves persistentes do Supabase:', supabaseKeys);
        await AsyncStorage.multiRemove(supabaseKeys);
      }

      try {
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error) {
          console.error('Erro ao invalidar sessão globalmente:', error);
        }
      } catch (error) {
        console.error('Erro ao invalidar sessão globalmente:', error);
      }
    } catch (error) {
      console.error('Error in context signOut:', error);
    } finally {
      console.log('Definindo sessão como nula no estado.');
      setSession(null);
      setUser(null);

      for (let i = 0; i < 10; i++) {
        try {
          const { data } = await supabase.auth.getSession();
          if (!data.session) break;
        } catch {}
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setSigningOut(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isSigningOut, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
