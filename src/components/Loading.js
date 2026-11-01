import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function Loading({ message = 'Đang tải dữ liệu...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0066cc" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});
