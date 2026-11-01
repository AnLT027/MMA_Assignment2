import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../api/productService';

/**
 * Custom Hook: useProducts
 * Tách biệt logic gọi API và quản lý state sản phẩm khỏi UI
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setError(null);
    const { data, error: apiError } = await fetchProducts();
    if (apiError) {
      setError(apiError);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  return {
    products,
    loading,
    refreshing,
    error,
    onRefresh,
    reload: () => {
      setLoading(true);
      loadProducts();
    },
  };
};
