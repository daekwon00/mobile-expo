import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, RefreshControl,
  Pressable, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';
import type { Board, PostListItem, PageResponse } from '@/types';

export default function BoardScreen() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 게시판 목록 조회
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Board[]>('/api/v1/boards');
        setBoards(res.data);
        if (res.data.length > 0) {
          setSelectedBoard(res.data[0].id);
        }
      } catch {
        // 에러 무시
      }
    })();
  }, []);

  // 선택된 게시판의 게시글 조회
  const fetchPosts = useCallback(async (boardId: string, pageNum: number) => {
    try {
      const res = await api.get<PageResponse<PostListItem>>(
        `/api/v1/boards/${boardId}/posts?page=${pageNum}&size=15`
      );
      setPosts(pageNum === 0 ? res.data.content : prev => [...prev, ...res.data.content]);
      setTotalPages(res.data.totalPages);
    } catch {
      // 에러 무시
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      setLoading(true);
      setPage(0);
      fetchPosts(selectedBoard, 0);
    }
  }, [selectedBoard, fetchPosts]);

  const onRefresh = useCallback(() => {
    if (!selectedBoard) return;
    setRefreshing(true);
    setPage(0);
    fetchPosts(selectedBoard, 0);
  }, [selectedBoard, fetchPosts]);

  const loadMore = useCallback(() => {
    if (!selectedBoard || page + 1 >= totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(selectedBoard, nextPage);
  }, [selectedBoard, page, totalPages, fetchPosts]);

  if (loading && posts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* 게시판 탭 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-12 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        contentContainerClassName="px-2 items-center"
      >
        {boards.map((board) => (
          <Pressable
            key={board.id}
            className={`mx-1 rounded-full px-4 py-2 ${
              selectedBoard === board.id
                ? 'bg-blue-600'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onPress={() => setSelectedBoard(board.id)}
          >
            <Text
              className={`text-sm font-medium ${
                selectedBoard === board.id
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {board.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* 게시글 목록 */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.length === 0 ? (
          <View className="items-center py-16">
            <Text className="text-sm text-gray-400">게시글이 없습니다</Text>
          </View>
        ) : (
          <>
            {posts.map((post, index) => (
              <Pressable
                key={post.id}
                className={`bg-white px-4 py-3 active:bg-gray-50 dark:bg-gray-800 dark:active:bg-gray-700 ${
                  index < posts.length - 1
                    ? 'border-b border-gray-100 dark:border-gray-700'
                    : ''
                }`}
                onPress={() => router.push(`/posts/${post.id}`)}
              >
                <Text
                  className="text-sm font-medium text-gray-900 dark:text-white"
                  numberOfLines={1}
                >
                  {post.title}
                </Text>
                <View className="mt-1.5 flex-row items-center gap-2">
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
            ))}

            {/* 더보기 */}
            {page + 1 < totalPages && (
              <Pressable
                className="mx-4 mt-3 items-center rounded-lg border border-gray-200 py-3 dark:border-gray-700"
                onPress={loadMore}
              >
                <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  더보기
                </Text>
              </Pressable>
            )}
          </>
        )}
      </ScrollView>

      {/* 글쓰기 FAB */}
      <Pressable
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg active:bg-blue-700"
        onPress={() => router.push(`/posts/create?boardId=${selectedBoard}`)}
      >
        <Text className="text-2xl font-light text-white">+</Text>
      </Pressable>
    </View>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
