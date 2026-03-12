import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Post } from '@/types';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Post>(`/api/v1/posts/${id}`);
        setPost(res.data);
      } catch {
        Alert.alert('오류', '게시글을 불러올 수 없습니다.', [
          { text: '확인', onPress: () => router.back() },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = () => {
    Alert.alert('삭제 확인', '게시글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/v1/posts/${id}`);
            router.back();
          } catch {
            Alert.alert('오류', '삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!post) return null;

  const isAuthor = user?.id === post.author.id;

  return (
    <>
      <Stack.Screen
        options={{
          title: '게시글',
          headerRight: isAuthor
            ? () => (
                <Text
                  className="text-sm text-red-500"
                  onPress={handleDelete}
                >
                  삭제
                </Text>
              )
            : undefined,
        }}
      />
      <ScrollView
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        contentContainerClassName="pb-8"
      >
        {/* 헤더 */}
        <View className="bg-white px-4 pb-4 pt-5 dark:bg-gray-800">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            {post.title}
          </Text>
          <View className="mt-3 flex-row items-center gap-3">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Text className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                {post.author.name.charAt(0)}
              </Text>
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {post.author.name}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {formatDateTime(post.createdAt)} · 조회 {post.viewCount}
              </Text>
            </View>
          </View>
        </View>

        {/* 첨부파일 */}
        {post.files.length > 0 && (
          <View className="mt-2 bg-white px-4 py-3 dark:bg-gray-800">
            <Text className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              첨부파일 ({post.files.length})
            </Text>
            {post.files.map((file) => (
              <View
                key={file.id}
                className="flex-row items-center gap-2 py-1"
              >
                <Text className="text-xs text-gray-400">📎</Text>
                <Text className="flex-1 text-sm text-blue-600 dark:text-blue-400" numberOfLines={1}>
                  {file.originalName}
                </Text>
                <Text className="text-xs text-gray-400">
                  {formatFileSize(file.size)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 본문 */}
        <View className="mt-2 bg-white px-4 py-5 dark:bg-gray-800">
          <Text className="text-base leading-6 text-gray-800 dark:text-gray-200">
            {post.content}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
