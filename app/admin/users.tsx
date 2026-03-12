import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, RefreshControl,
  Pressable, ActivityIndicator, Alert, TextInput,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { api } from '@/lib/api';
import type { AdminUser, PageResponse } from '@/types';

export default function AdminUsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async (pageNum: number, searchText: string) => {
    try {
      const params = `page=${pageNum}&size=20${searchText ? `&search=${searchText}` : ''}`;
      const res = await api.get<PageResponse<AdminUser>>(`/api/v1/admin/users?${params}`);
      setUsers(pageNum === 0 ? res.data.content : prev => [...prev, ...res.data.content]);
      setTotalPages(res.data.totalPages);
    } catch {
      // 에러 무시
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(0, search);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(0);
    fetchUsers(0, search);
  }, [search, fetchUsers]);

  const onSearch = useCallback(() => {
    setLoading(true);
    setPage(0);
    fetchUsers(0, search);
  }, [search, fetchUsers]);

  const loadMore = useCallback(() => {
    if (page + 1 >= totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage, search);
  }, [page, totalPages, search, fetchUsers]);

  const toggleActive = useCallback(async (userId: number, currentActive: boolean) => {
    try {
      await api.put(`/api/v1/admin/users/${userId}/toggle-active`);
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, isActive: !currentActive } : u)
      );
    } catch {
      Alert.alert('오류', '상태 변경에 실패했습니다.');
    }
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: '사용자 관리' }} />
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* 검색 */}
        <View className="flex-row items-center gap-2 bg-white px-4 py-2 dark:bg-gray-800">
          <TextInput
            className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-900 dark:bg-gray-700 dark:text-white"
            placeholder="이름, 아이디 검색"
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={onSearch}
            returnKeyType="search"
          />
          <Pressable
            className="rounded-lg bg-blue-600 px-4 py-2 active:bg-blue-700"
            onPress={onSearch}
          >
            <Text className="text-sm font-medium text-white">검색</Text>
          </Pressable>
        </View>

        {loading && users.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerClassName="pb-4"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {users.map((user, index) => (
              <Pressable
                key={user.id}
                className={`flex-row items-center bg-white px-4 py-3 active:bg-gray-50 dark:bg-gray-800 dark:active:bg-gray-700 ${
                  index < users.length - 1
                    ? 'border-b border-gray-100 dark:border-gray-700'
                    : ''
                }`}
                onPress={() => router.push(`/admin/user-edit?userId=${user.id}`)}
              >
                <View className={`h-9 w-9 items-center justify-center rounded-full ${
                  user.isActive ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <Text className={`text-sm font-semibold ${
                    user.isActive ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400'
                  }`}>
                    {user.name.charAt(0)}
                  </Text>
                </View>
                <View className="ml-3 flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </Text>
                    <View className={`rounded-full px-2 py-0.5 ${
                      user.role === 'ADMIN' || user.role === 'ROLE_ADMIN' ? 'bg-red-100 dark:bg-red-900' : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Text className={`text-[10px] font-medium ${
                        user.role === 'ADMIN' || user.role === 'ROLE_ADMIN' ? 'text-red-600 dark:text-red-300' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {user.role === 'ADMIN' || user.role === 'ROLE_ADMIN' ? '관리자' : '사용자'}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    @{user.username} · {user.email}
                  </Text>
                </View>
                <Pressable
                  className={`rounded-full px-3 py-1 ${
                    user.isActive ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  onPress={() => toggleActive(user.id, user.isActive)}
                >
                  <Text className={`text-xs font-medium ${
                    user.isActive ? 'text-green-600 dark:text-green-300' : 'text-gray-500'
                  }`}>
                    {user.isActive ? '활성' : '비활성'}
                  </Text>
                </Pressable>
              </Pressable>
            ))}

            {page + 1 < totalPages && (
              <Pressable
                className="mx-4 mt-3 items-center rounded-lg border border-gray-200 py-3 dark:border-gray-700"
                onPress={loadMore}
              >
                <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">더보기</Text>
              </Pressable>
            )}
          </ScrollView>
        )}
      </View>
    </>
  );
}
