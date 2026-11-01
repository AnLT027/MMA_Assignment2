import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorView from '../components/ErrorView';
import EmptyView from '../components/EmptyView';
import { triggerLocalNotification } from '../services/notificationService';

export default function ProductListScreen({ onSelectProduct }) {
  const { products, loading, refreshing, error, onRefresh, reload } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const { addToCart } = useCart();

  // Search filter
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    triggerLocalNotification(
      'Giỏ hàng',
      `Đã thêm "${product.title.slice(0, 30)}..." vào giỏ hàng!`
    );
  };

  // 1. Trạng thái Loading
  if (loading) {
    return <Loading message="Đang tải danh sách sản phẩm..." />;
  }

  // 2. Trạng thái Lỗi mạng (ErrorView kèm nút Thử lại)
  if (error && products.length === 0) {
    return (
      <ErrorView
        message={`Lỗi kết nối: ${error}`}
        onRetry={reload}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Tìm kiếm sản phẩm, danh mục..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* 3. Trạng thái EmptyView hoặc FlatList */}
      {filteredProducts.length === 0 ? (
        <EmptyView message="Không tìm thấy sản phẩm phù hợp" />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onAddToCart={() => handleAddToCart(item)}
              onPress={() => onSelectProduct && onSelectProduct(item)}
            />
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
  header: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 14,
    color: '#333',
  },
  listContent: {
    padding: 12,
  },
});
