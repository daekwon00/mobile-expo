import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, RefreshControl,
  Pressable, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { DashboardStats, PostListItem } from '@/types';

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        api.get<DashboardStats>('/api/v1/dashboard/stats'),
        api.get<PostListItem[]>('/api/v1/posts/recent'),
      ]);
      setStats(statsRes.data);
      setRecentPosts(postsRes.data);
    } catch {
      // 에러 시 기존 데이터 유지
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
      {/* 인사말 */}
      <Text className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        안녕하세요, {user?.name ?? '사용자'}님
      </Text>

      {/* 통계 카드 */}
      {stats && (
        <View className="mb-6 flex-row flex-wrap gap-3">
          <StatCard label="전체 게시글" value={stats.totalPosts} color="bg-blue-500" />
          <StatCard label="오늘 게시글" value={stats.todayPosts} color="bg-green-500" />
          <StatCard label="전체 사용자" value={stats.totalUsers} color="bg-purple-500" />
          <StatCard label="내 게시글" value={stats.myPosts} color="bg-orange-500" />
        </View>
      )}

      {/* 최근 게시글 */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">
          최근 게시글
        </Text>
        <Pressable onPress={() => router.push('/(tabs)/board')}>
          <Text className="text-sm text-blue-600 dark:text-blue-400">전체보기</Text>
        </Pressable>
      </View>

      <View className="rounded-xl bg-white dark:bg-gray-800">
        {recentPosts.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-sm text-gray-400">게시글이 없습니다</Text>
          </View>
        ) : (
          recentPosts.map((post, index) => (
            <Pressable
              key={post.id}
              className={`px-4 py-3 active:bg-gray-50 dark:active:bg-gray-700 ${
                index < recentPosts.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
              }`}
              onPress={() => router.push(`/posts/${post.id}`)}
            >
              <Text
                className="text-sm font-medium text-gray-900 dark:text-white"
                numberOfLines={1}
              >
                {post.title}
              </Text>
              <View className="mt-1 flex-row items-center gap-2">
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {post.authorName}
                </Text>
                <Text className="text-xs text-gray-300 dark:text-gray-600">|</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(post.createdAt)}
                </Text>
                <Text className="text-xs text-gray-300 dark:text-gray-600">|</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  조회 {post.viewCount}
                </Text>
              </View>
            </Pressable>
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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}
