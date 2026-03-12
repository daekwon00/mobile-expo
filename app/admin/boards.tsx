import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, RefreshControl,
  Pressable, ActivityIndicator, Alert,
  TextInput, Modal,
} from 'react-native';
import { Stack } from 'expo-router';
import { api } from '@/lib/api';
import type { AdminBoard } from '@/types';

export default function AdminBoardsScreen() {
  const [boards, setBoards] = useState<AdminBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editBoard, setEditBoard] = useState<AdminBoard | null>(null);
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchBoards = useCallback(async () => {
    try {
      const res = await api.get<AdminBoard[]>('/api/v1/admin/boards');
      setBoards(res.data);
    } catch {
      // 에러 무시
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBoards();
  }, [fetchBoards]);

  const openCreate = () => {
    setEditBoard(null);
    setFormId('');
    setFormName('');
    setFormDesc('');
    setModalVisible(true);
  };

  const openEdit = (board: AdminBoard) => {
    setEditBoard(board);
    setFormId(board.id);
    setFormName(board.name);
    setFormDesc(board.description);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      Alert.alert('알림', '게시판 이름을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      if (editBoard) {
        await api.put(`/api/v1/admin/boards/${editBoard.id}`, {
          name: formName.trim(),
          description: formDesc.trim(),
        });
      } else {
        if (!formId.trim()) {
          Alert.alert('알림', '게시판 ID를 입력해주세요.');
          setSaving(false);
          return;
        }
        await api.post('/api/v1/admin/boards', {
          id: formId.trim(),
          name: formName.trim(),
          description: formDesc.trim(),
        });
      }
      setModalVisible(false);
      fetchBoards();
    } catch (error) {
      Alert.alert('오류', error instanceof Error ? error.message : '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (boardId: string) => {
    try {
      await api.patch(`/api/v1/admin/boards/${boardId}/toggle-active`);
      setBoards(prev =>
        prev.map(b => b.id === boardId ? { ...b, isActive: !b.isActive } : b)
      );
    } catch {
      Alert.alert('오류', '상태 변경에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '게시판 관리',
          headerRight: () => (
            <Pressable onPress={openCreate}>
              <Text className="text-sm font-semibold text-blue-600">추가</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        contentContainerClassName="pb-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {boards.map((board, index) => (
          <Pressable
            key={board.id}
            className={`flex-row items-center bg-white px-4 py-4 active:bg-gray-50 dark:bg-gray-800 dark:active:bg-gray-700 ${
              index < boards.length - 1
                ? 'border-b border-gray-100 dark:border-gray-700'
                : ''
            }`}
            onPress={() => openEdit(board)}
          >
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-medium text-gray-900 dark:text-white">
                  {board.name}
                </Text>
                <Text className="text-xs text-gray-400">({board.id})</Text>
              </View>
              <Text className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {board.description || '설명 없음'} · 게시글 {board.postCount}개
              </Text>
            </View>
            <Pressable
              className={`rounded-full px-3 py-1 ${
                board.isActive ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              onPress={() => toggleActive(board.id)}
            >
              <Text className={`text-xs font-medium ${
                board.isActive ? 'text-green-600 dark:text-green-300' : 'text-gray-500'
              }`}>
                {board.isActive ? '활성' : '비활성'}
              </Text>
            </Pressable>
          </Pressable>
        ))}
      </ScrollView>

      {/* 생성/수정 모달 */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
          <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
            <Pressable onPress={() => setModalVisible(false)}>
              <Text className="text-sm text-gray-500">취소</Text>
            </Pressable>
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              {editBoard ? '게시판 수정' : '게시판 추가'}
            </Text>
            <Pressable onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text className="text-sm font-semibold text-blue-600">저장</Text>
              )}
            </Pressable>
          </View>

          <View className="mt-4 bg-white dark:bg-gray-800">
            {!editBoard && (
              <View className="flex-row items-center border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                <Text className="w-20 text-sm text-gray-500 dark:text-gray-400">ID</Text>
                <TextInput
                  className="flex-1 text-sm text-gray-900 dark:text-white"
                  placeholder="영문 소문자 (예: notice)"
                  placeholderTextColor="#9ca3af"
                  value={formId}
                  onChangeText={setFormId}
                  autoCapitalize="none"
                />
              </View>
            )}
            <View className="flex-row items-center border-b border-gray-100 px-4 py-3 dark:border-gray-700">
              <Text className="w-20 text-sm text-gray-500 dark:text-gray-400">이름</Text>
              <TextInput
                className="flex-1 text-sm text-gray-900 dark:text-white"
                placeholder="게시판 이름"
                placeholderTextColor="#9ca3af"
                value={formName}
                onChangeText={setFormName}
              />
            </View>
            <View className="flex-row items-center px-4 py-3">
              <Text className="w-20 text-sm text-gray-500 dark:text-gray-400">설명</Text>
              <TextInput
                className="flex-1 text-sm text-gray-900 dark:text-white"
                placeholder="게시판 설명"
                placeholderTextColor="#9ca3af"
                value={formDesc}
                onChangeText={setFormDesc}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
