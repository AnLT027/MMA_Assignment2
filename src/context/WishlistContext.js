import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import {
  addToWishlistFirebase,
  removeFromWishlistFirebase,
  subscribeWishlist,
} from '../services/firebaseService';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  // Lắng nghe realtime từ Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeWishlist(
      (items) => {
        setWishlistItems(items);
        setFirebaseError(null);
        setLoading(false);
      },
      (error) => {
        console.warn('Lỗi Firestore Wishlist:', error);
        setFirebaseError('Không thể kết nối Firebase Wishlist');
        setLoading(false);
        // Alert nhẹ nhàng, không crash app
        Alert.alert('Firebase Notice', 'Không thể đồng bộ Wishlist realtime. Đang ở chế độ offline.');
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => String(item.productId || item.id) === String(productId)
    );
  };

  const toggleWishlist = async (product) => {
    const isSaved = isInWishlist(product.id);
    if (isSaved) {
      // Optimistic update
      setWishlistItems((prev) =>
        prev.filter((i) => String(i.productId || i.id) !== String(product.id))
      );
      const res = await removeFromWishlistFirebase(product.id);
      if (!res.success) {
        Alert.alert('Lỗi', 'Không thể xóa khỏi Firebase Wishlist');
      }
    } else {
      // Optimistic update
      setWishlistItems((prev) => [
        ...prev,
        {
          id: String(product.id),
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
        },
      ]);
      const res = await addToWishlistFirebase(product);
      if (!res.success) {
        Alert.alert('Lỗi', 'Không thể lưu vào Firebase Wishlist');
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        loading,
        firebaseError,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist phải được dùng bên trong WishlistProvider');
  }
  return context;
};
