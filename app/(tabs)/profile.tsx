import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, RefreshControl,
  Pressable, ActivityIndicator, Alert,
} from 'react-native';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { UserProfile } from '@/types';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get<UserProfile>('/api/v1/users/me');
      setProfile(res.data);
    } catch {
      // 에러 무시
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: signOut },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const p = profile ?? user;

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      contentContainerClassName="pb-8"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* 프로필 헤더 */}
      <View className="items-center bg-white px-4 pb-6 pt-8 dark:bg-gray-800">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <Text className="text-3xl font-bold text-blue-600 dark:text-blue-300">
            {p?.name?.charAt(0) ?? '?'}
          </Text>
        </View>
        <Text className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
          {p?.name}
        </Text>
        <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          @{p?.username}
        </Text>
      </View>

      {/* 기본 정보 */}
      <View className="mt-4">
        <Text className="px-4 pb-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
          기본 정보
        </Text>
        <View className="bg-white dark:bg-gray-800">
          <InfoRow label="이메일" value={p?.email} />
          {profile && (
            <>
              <InfoRow label="전화번호" value={profile.phone ?? '미등록'} />
              <InfoRow label="부서" value={profile.department ?? '미지정'} />
              <InfoRow label="직급" value={profile.position ?? '미지정'} />
            </>
          )}
        </View>
      </View>

      {/* 계정 정보 */}
      <View className="mt-4">
        <Text className="px-4 pb-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
          계정 정보
        </Text>
        <View className="bg-white dark:bg-gray-800">
          <InfoRow label="권한" value={formatRole(p?.role)} />
          {profile?.createdAt && (
            <InfoRow label="가입일" value={formatDate(profile.createdAt)} />
          )}
        </View>
      </View>

      {/* 로그아웃 */}
      <View className="mt-6 px-4">
        <Pressable
          className="items-center rounded-lg border border-red-200 bg-white py-3.5 active:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:active:bg-red-900"
          onPress={handleLogout}
        >
          <Text className="text-base font-medium text-red-600 dark:text-red-400">
            로그아웃
          </Text>
        </Pressable>
      </View>

      {/* 앱 버전 */}
      <Text className="mt-4 text-center text-xs text-gray-400">
        YDK Lab Mobile v1.0.0
      </Text>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View className="flex-row items-center border-b border-gray-100 px-4 py-3 dark:border-gray-700">
      <Text className="w-20 text-sm text-gray-500 dark:text-gray-400">{label}</Text>
      <Text className="flex-1 text-sm text-gray-900 dark:text-white">
        {value ?? '-'}
      </Text>
    </View>
  );
}

function formatRole(role?: string): string {
  if (!role) return '-';
  const roleMap: Record<string, string> = {
    ROLE_ADMIN: '관리자',
    ROLE_USER: '일반 사용자',
  };
  return roleMap[role] ?? role;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}
