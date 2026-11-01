import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
  isFavorite = false,
  onToggleFavorite,
}) {
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
        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={onToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category?.toUpperCase()}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>

        {onAddToCart && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddToCart}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>+ Giỏ hàng</Text>
          </TouchableOpacity>
        )}
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
    position: 'relative',
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
  favoriteBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    padding: 2,
  },
  favoriteIcon: {
    fontSize: 14,
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
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
    marginVertical: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: 6,
  },
  addButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
