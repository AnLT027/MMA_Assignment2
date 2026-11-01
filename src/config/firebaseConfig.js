import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Cấu hình Firebase trích xuất từ file .env / google-services.json
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCGou9a4glzKutcTwWaq-hjVex3e-UDVxo',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mma301-ecommerce.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'mma301-ecommerce',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mma301-ecommerce.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '468414890507',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:468414890507:android:310a9a6f6c4275f368bd0e',
};

// Đảm bảo không khởi tạo lại nếu app đã tồn tại
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
