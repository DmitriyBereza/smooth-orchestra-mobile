import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { get } from '../../lib/api';
import { stageColor, stageLabel } from '../../lib/ui';
import type { SessionState, ArtifactMeta } from '../../lib/types';

function formatDate(isoString: string | null): string {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function artifactLabel(type: string): string {
  const labels: Record<string, string> = {
    story: 'Story',
    design: 'Design',
    'dev-tasks': 'Dev Tasks',
    'dev-notes': 'Dev Notes',
    'qa-spec': 'QA Spec',
    review: 'Review',
  };
  return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

export default function TaskDetailScreen() {
  const { taskId, session: sessionParam } = useLocalSearchParams<{
    taskId: string;
    session?: string;
  }>();
  const router = useRouter();

  const [session, setSession] = useState<SessionState | null>(null);
  const [artifacts, setArtifacts] = useState<ArtifactMeta[]>([]);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isLoadingArtifacts, setIsLoadingArtifacts] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoadingSession(true);
      try {
        if (sessionParam) {
          setSession(JSON.parse(sessionParam));
        } else {
          const history = await get<SessionState[]>('/api/sessions/history');
          const found = history.find((s) => s.id === taskId);
          if (found) setSession(found);
        }
      } finally {
        setIsLoadingSession(false);
      }
    }
    load();
  }, [taskId, sessionParam]);

  useEffect(() => {
    if (!taskId) return;
    setIsLoadingArtifacts(true);
    get<ArtifactMeta[]>(`/api/artifacts/${taskId}`)
      .then(setArtifacts)
      .catch(() => setArtifacts([]))
      .finally(() => setIsLoadingArtifacts(false));
  }, [taskId]);

  if (isLoadingSession) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Task not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{session.task.title}</Text>
        {session.task.description && (
          <Text style={styles.description}>{session.task.description}</Text>
        )}
        <View style={[styles.badge, { backgroundColor: stageColor(session.currentStage) }]}>
          <Text style={styles.badgeText}>{stageLabel(session.currentStage)}</Text>
        </View>
        <Text style={styles.meta}>Created: {formatDate(session.task.createdAt)}</Text>
        <Text style={styles.meta}>Completed: {formatDate(session.completedAt)}</Text>
        {session.pipelineType && (
          <Text style={styles.meta}>Pipeline: {session.pipelineType}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Artifacts</Text>
        {isLoadingArtifacts ? (
          <ActivityIndicator />
        ) : artifacts.length === 0 ? (
          <Text style={styles.emptyText}>No artifacts yet</Text>
        ) : (
          artifacts.map((artifact) => (
            <TouchableOpacity
              key={artifact.type}
              style={styles.artifactRow}
              onPress={() =>
                router.push({
                  pathname: '/tasks/[taskId]/[type]',
                  params: { taskId, type: artifact.type },
                })
              }
            >
              <Text style={styles.artifactLabel}>{artifactLabel(artifact.type)}</Text>
              <Text style={styles.artifactStage}>{artifact.stage}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 15, color: '#374151', marginBottom: 12 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  meta: { color: '#6b7280', fontSize: 13, marginBottom: 4 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '600', marginBottom: 12 },
  artifactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  artifactLabel: { fontSize: 15, fontWeight: '500' },
  artifactStage: { color: '#6b7280', fontSize: 13 },
  emptyText: { color: '#6b7280' },
  errorText: { color: '#ef4444', fontSize: 16 },
});
