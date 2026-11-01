import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { CartProvider, useCart } from './src/context/CartContext';
import { WishlistProvider, useWishlist } from './src/context/WishlistContext';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import WishlistScreen from './src/screens/WishlistScreen';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('products'); // 'products' | 'cart' | 'wishlist'
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { totalCount } = useCart();
  const { wishlistItems } = useWishlist();

  // Khi chọn xem chi tiết sản phẩm
  if (selectedProduct) {
    return (
      <ProductDetailScreen
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Main Content View */}
      <View style={styles.content}>
        {currentTab === 'products' && (
          <ProductListScreen onSelectProduct={(p) => setSelectedProduct(p)} />
        )}
        {currentTab === 'cart' && (
          <CartScreen onGoShopping={() => setCurrentTab('products')} />
        )}
        {currentTab === 'wishlist' && (
          <WishlistScreen onSelectProduct={(p) => setSelectedProduct(p)} />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('products')}
        >
          <Text style={[styles.navIcon, currentTab === 'products' && styles.activeIcon]}>
            🛍️
          </Text>
          <Text style={[styles.navText, currentTab === 'products' && styles.activeText]}>
            Sản phẩm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('cart')}
        >
          <View style={styles.iconWithBadge}>
            <Text style={[styles.navIcon, currentTab === 'cart' && styles.activeIcon]}>
              🛒
            </Text>
            {totalCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalCount > 99 ? '99+' : totalCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.navText, currentTab === 'cart' && styles.activeText]}>
            Giỏ hàng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('wishlist')}
        >
          <View style={styles.iconWithBadge}>
            <Text style={[styles.navIcon, currentTab === 'wishlist' && styles.activeIcon]}>
              ❤️
            </Text>
            {wishlistItems.length > 0 && (
              <View style={[styles.badge, styles.wishlistBadge]}>
                <Text style={styles.badgeText}>{wishlistItems.length}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.navText, currentTab === 'wishlist' && styles.activeText]}>
            Yêu thích
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <MainApp />
      </WishlistProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 56,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  activeIcon: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  navText: {
    fontSize: 10,
    color: '#777',
    marginTop: 2,
  },
  activeText: {
    color: '#0066cc',
    fontWeight: '700',
  },
  iconWithBadge: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#e53935',
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  wishlistBadge: {
    backgroundColor: '#e91e63',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
