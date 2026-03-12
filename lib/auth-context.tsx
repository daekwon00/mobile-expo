import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, useSegments } from 'expo-router';
import type { UserInfo } from '@/types';
import * as authApi from './auth';
import { tokenStorage } from './storage';

type AuthState = {
  user: UserInfo | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (params: { username: string; password: string; name: string; email: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // 앱 시작 시 저장된 토큰으로 사용자 정보 복원
  useEffect(() => {
    (async () => {
      try {
        const token = await tokenStorage.getAccessToken();
        if (token) {
          const profile = await authApi.getMyProfile();
          setUser(profile);
        }
      } catch {
        await tokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 인증 상태에 따른 라우트 보호
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  const signIn = useCallback(async (username: string, password: string) => {
    const result = await authApi.login({ username, password });
    setUser(result.user);
  }, []);

  const signUp = useCallback(async (params: { username: string; password: string; name: string; email: string }) => {
    await authApi.register(params);
    // 회원가입 성공 후 자동 로그인
    const result = await authApi.login({ username: params.username, password: params.password });
    setUser(result.user);
  }, []);

  const signOut = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
