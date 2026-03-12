import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { api } from '@/lib/api';
import type { Post } from '@/types';

export default function CreatePostScreen() {
  const { boardId } = useLocalSearchParams<{ boardId: string }>();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await api.post<Post>('/api/v1/posts', {
        boardId,
        title: title.trim(),
        content: content.trim(),
      });
      router.back();
    } catch (error) {
      Alert.alert('오류', error instanceof Error ? error.message : '게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '게시글 작성',
          headerRight: () => (
            <Pressable onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text className="text-sm font-semibold text-blue-600">등록</Text>
              )}
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* 제목 */}
          <View className="bg-white px-4 py-3 dark:bg-gray-800">
            <TextInput
              className="text-base text-gray-900 dark:text-white"
              placeholder="제목을 입력하세요"
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
            />
          </View>

          <View className="h-px bg-gray-100 dark:bg-gray-700" />

          {/* 내용 */}
          <View className="bg-white px-4 py-3 dark:bg-gray-800">
            <TextInput
              className="min-h-[300px] text-base leading-6 text-gray-900 dark:text-white"
              placeholder="내용을 입력하세요"
              placeholderTextColor="#9ca3af"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
