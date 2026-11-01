import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyView({ message = 'Không có sản phẩm nào' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📦</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 44,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
