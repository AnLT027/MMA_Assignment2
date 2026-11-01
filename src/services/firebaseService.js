import { db } from '../config/firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

const WISHLIST_COLLECTION = 'wishlist';

/**
 * Thêm hoặc cập nhật sản phẩm vào collection 'wishlist' trên Firestore
 * Sử dụng doc ID là chuỗi productId để tránh trùng lặp
 */
export const addToWishlistFirebase = async (product) => {
  try {
    const docRef = doc(db, WISHLIST_COLLECTION, String(product.id));
    const dataToSave = {
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category || '',
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, dataToSave);
    return { success: true };
  } catch (error) {
    console.error('Firebase addToWishlist Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Xóa sản phẩm khỏi collection 'wishlist' trên Firestore
 */
export const removeFromWishlistFirebase = async (productId) => {
  try {
    const docRef = doc(db, WISHLIST_COLLECTION, String(productId));
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Firebase removeFromWishlist Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Lấy danh sách Wishlist 1 lần (dùng khi snapshot lỗi hoặc muốn load tĩnh)
 */
export const getWishlistOnce = async () => {
  try {
    const colRef = collection(db, WISHLIST_COLLECTION);
    const snapshot = await getDocs(colRef);
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    return { items, error: null };
  } catch (error) {
    console.error('Firebase getWishlistOnce Error:', error);
    return { items: [], error: error.message };
  }
};

/**
 * Lắng nghe thời gian thực (realtime) từ Firestore collection 'wishlist'
 * Có callback xử lý khi mất mạng/lỗi quyền
 */
export const subscribeWishlist = (onUpdate, onError) => {
  try {
    const colRef = collection(db, WISHLIST_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        onUpdate(items);
      },
      (error) => {
        console.error('Firestore realtime error:', error);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (err) {
    if (onError) onError(err);
    return () => {};
  }
};
