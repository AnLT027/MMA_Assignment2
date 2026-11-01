import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import EmptyView from '../components/EmptyView';
import { triggerLocalNotification } from '../services/notificationService';

export default function WishlistScreen({ onSelectProduct }) {
  const { wishlistItems, toggleWishlist, loading, firebaseError } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart(item, 1);
    triggerLocalNotification(
      'Giỏ hàng',
      `Đã chuyển "${item.title.slice(0, 25)}..." vào giỏ hàng!`
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Đang đồng bộ Firestore Wishlist...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Yêu thích (Firestore: {wishlistItems.length})
        </Text>
        {firebaseError && <Text style={styles.errorBanner}>⚠️ Offline</Text>}
      </View>

      {wishlistItems.length === 0 ? (
        <EmptyView message="Chưa có sản phẩm yêu thích nào trên Firebase" />
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => String(item.id || item.productId)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <TouchableOpacity
                style={styles.imageBox}
                onPress={() => onSelectProduct && onSelectProduct(item)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <View style={styles.infoBox}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.price}>
                  ${Number(item.price).toFixed(2)}
                </Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.cartBtn}
                    onPress={() => handleMoveToCart(item)}
                  >
                    <Text style={styles.cartBtnText}>+ Thêm vào giỏ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => toggleWishlist(item)}
                  >
                    <Text style={styles.removeBtnText}>Bỏ thích</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  errorBanner: {
    fontSize: 12,
    color: '#d9534f',
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageBox: {
    width: 80,
    height: 80,
    backgroundColor: '#fafafa',
    borderRadius: 6,
    padding: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoBox: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBtn: {
    backgroundColor: '#0066cc',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 10,
  },
  cartBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  removeBtn: {
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  removeBtnText: {
    color: '#888',
    fontSize: 11,
  },
});
