import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category?.toUpperCase()}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  imageContainer: {
    width: 90,
    height: 90,
    backgroundColor: '#fafafa',
    borderRadius: 6,
    padding: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  category: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginVertical: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0066cc',
    marginTop: 2,
  },
});
