import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export const signInWithGoogle = async () => {
  try {
    const projectName =
      Constants.expoConfig?.slug ?? Constants.manifest2?.extra?.expoClient?.slug ?? 'nutra-app';
    
    const owner = Constants.expoConfig?.owner ?? 'ceopear';

    const redirectTo =
      Platform.OS === 'web'
        ? typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : ''
        : `https://auth.expo.io/@${owner}/${projectName}/auth/callback`;

    console.log('USING_PROXY_REDIRECT:', redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('Missing auth url from Supabase');

    if (Platform.OS !== 'web') {
      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      console.log('WEBBROWSER_RESULT:', res);
    } else {
      window.location.href = data.url;
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    Alert.alert('Erro no Login', (error as Error).message);
    throw error;
  }
};
