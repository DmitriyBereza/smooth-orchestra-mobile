import { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { get } from '../../../lib/api';
import type { ArtifactContent } from '../../../lib/types';

export default function ArtifactViewerScreen() {
  const { taskId, type } = useLocalSearchParams<{ taskId: string; type: string }>();
  const navigation = useNavigation();
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (type) {
      navigation.setOptions({
        title: type.charAt(0).toUpperCase() + type.slice(1),
      });
    }
  }, [type, navigation]);

  const fetchContent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await get<ArtifactContent>(`/api/artifacts/${taskId}/${type}`);
      setContent(data.content);
    } catch {
      setError('Failed to load artifact');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [taskId, type]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchContent}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} removeClippedSubviews>
      <Markdown style={markdownStyles}>{content || ''}</Markdown>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { color: '#ef4444', marginBottom: 12, fontSize: 16 },
  retryButton: { backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
});

const markdownStyles = {
  body: { fontSize: 15, lineHeight: 24, color: '#1f2937' },
  heading1: { fontSize: 24, fontWeight: 'bold' as const, marginVertical: 12, color: '#111827' },
  heading2: { fontSize: 20, fontWeight: '600' as const, marginVertical: 10, color: '#1f2937' },
  heading3: { fontSize: 17, fontWeight: '600' as const, marginVertical: 8, color: '#374151' },
  code_block: {
    backgroundColor: '#f3f4f6',
    fontFamily: 'Courier',
    fontSize: 13,
    padding: 12,
    borderRadius: 6,
  },
  code_inline: {
    backgroundColor: '#f3f4f6',
    fontFamily: 'Courier',
    fontSize: 13,
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  fence: {
    backgroundColor: '#f3f4f6',
    fontFamily: 'Courier',
    fontSize: 13,
    padding: 12,
    borderRadius: 6,
  },
};
