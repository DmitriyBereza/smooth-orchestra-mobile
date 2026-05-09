import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../lib/AuthContext';
import { loadServerUrl } from '../../lib/auth';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const [serverUrl, setServerUrl] = useState<string | null>(null);

  useEffect(() => {
    loadServerUrl().then(setServerUrl);
  }, []);

  return (
    <View style={styles.container}>
      {serverUrl && (
        <Text style={styles.server}>Connected to: {serverUrl}</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  server: { color: '#6b7280', marginBottom: 24, fontSize: 14, textAlign: 'center' },
  button: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
