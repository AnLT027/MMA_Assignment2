import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export default function ProductDetailScreen({ product, onBack }) {
  if (!product) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View style={styles.detailsContainer}>
          <Text style={styles.category}>{product.category?.toUpperCase()}</Text>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
            {product.rating && (
              <Text style={styles.rating}>
                ⭐ {product.rating.rate} ({product.rating.count} đánh giá)
              </Text>
            )}
          </View>

          <Text style={styles.descTitle}>Mô tả chi tiết:</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 20,
  },
  category: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    lineHeight: 28,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  rating: {
    fontSize: 13,
    color: '#e67e22',
  },
  descTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
});
