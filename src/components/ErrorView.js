import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ErrorView({ message = 'Có lỗi xảy ra', onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Không thể tải dữ liệu</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Thử lại</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
