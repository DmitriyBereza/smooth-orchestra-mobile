import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { get } from '../../lib/api';
import { timeAgo } from '../../lib/timeago';
import { stageColor, stageLabel } from '../../lib/ui';
import type { SessionState } from '../../lib/types';

export default function TaskListScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (refreshing = false) => {
    if (!refreshing) setIsLoading(true);
    setError(null);
    try {
      const data = await get<SessionState[]>('/api/sessions/history');
      setSessions(data);
    } catch {
      setError('Failed to load tasks');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTasks(true);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator testID="loading-indicator" size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchTasks()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (sessions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No tasks yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sessions}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push({ pathname: '/tasks/[taskId]', params: { taskId: item.id } })}
        >
          <Text style={styles.title}>{item.task.title}</Text>
          <View style={styles.meta}>
            <View style={[styles.badge, { backgroundColor: stageColor(item.currentStage) }]}>
              <Text style={styles.badgeText}>{stageLabel(item.currentStage)}</Text>
            </View>
            <Text style={styles.timestamp}>
              {timeAgo(item.completedAt || item.startedAt)}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  timestamp: { color: '#6b7280', fontSize: 13 },
  errorText: { color: '#ef4444', marginBottom: 12, fontSize: 16 },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },
  emptyText: { color: '#6b7280', fontSize: 16 },
});
