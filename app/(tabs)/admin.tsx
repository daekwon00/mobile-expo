import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, RefreshControl,
  Pressable, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';
import type { AdminDashboardStats, RecentUser } from '@/types';

export default function AdminScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get<AdminDashboardStats>('/api/v1/admin/dashboard/stats'),
        api.get<RecentUser[]>('/api/v1/admin/dashboard/recent-users'),
      ]);
      setStats(statsRes.data);
      setRecentUsers(usersRes.data);
    } catch {
      // 권한 없음 등
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      contentContainerClassName="p-4 pb-8"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* 통계 카드 */}
      {stats && (
        <View className="mb-6 flex-row flex-wrap gap-3">
          <StatCard label="전체 사용자" value={stats.totalUsers} color="bg-blue-500" />
          <StatCard label="오늘 가입" value={stats.todayRegistered} color="bg-green-500" />
          <StatCard label="활성 게시판" value={stats.activeBoards} color="bg-purple-500" />
          <StatCard label="오늘 게시글" value={stats.todayPosts} color="bg-orange-500" />
        </View>
      )}

      {/* 관리 메뉴 */}
      <Text className="mb-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
        관리 메뉴
      </Text>
      <View className="mb-6 rounded-xl bg-white dark:bg-gray-800">
        <MenuItem
          title="사용자 관리"
          subtitle="사용자 목록, 등록, 권한 설정"
          onPress={() => router.push('/admin/users')}
        />
        <MenuItem
          title="게시판 관리"
          subtitle="게시판 생성, 수정, 활성화"
          onPress={() => router.push('/admin/boards')}
          isLast
        />
      </View>

      {/* 최근 가입 사용자 */}
      <Text className="mb-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
        최근 가입 사용자
      </Text>
      <View className="rounded-xl bg-white dark:bg-gray-800">
        {recentUsers.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-sm text-gray-400">최근 가입자가 없습니다</Text>
          </View>
        ) : (
          recentUsers.map((user, index) => (
            <View
              key={user.id}
              className={`flex-row items-center px-4 py-3 ${
                index < recentUsers.length - 1
                  ? 'border-b border-gray-100 dark:border-gray-700'
                  : ''
              }`}
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Text className="text-sm font-semibold text-green-600 dark:text-green-300">
                  {user.name.charAt(0)}
                </Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  @{user.username} · {formatDate(user.createdAt)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View className="min-w-[46%] flex-1 rounded-xl bg-white p-4 dark:bg-gray-800">
      <View className={`mb-2 h-2 w-8 rounded-full ${color}`} />
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">
        {value.toLocaleString()}
      </Text>
      <Text className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{label}</Text>
    </View>
  );
}

function MenuItem({ title, subtitle, onPress, isLast = false }: {
  title: string; subtitle: string; onPress: () => void; isLast?: boolean;
}) {
  return (
    <Pressable
      className={`flex-row items-center px-4 py-4 active:bg-gray-50 dark:active:bg-gray-700 ${
        !isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''
      }`}
      onPress={onPress}
    >
      <View className="flex-1">
        <Text className="text-sm font-medium text-gray-900 dark:text-white">{title}</Text>
        <Text className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</Text>
      </View>
      <Text className="text-gray-400">›</Text>
    </Pressable>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
