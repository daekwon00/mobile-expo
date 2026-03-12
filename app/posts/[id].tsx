import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-xl font-bold text-black dark:text-white">게시글 #{id}</Text>
    </View>
  );
}
