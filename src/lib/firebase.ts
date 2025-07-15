// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // ✅ Kamu gunakan Realtime DB

const firebaseConfig = {
  apiKey: "AIzaSyBJbfM2qUQYo22QNGW1ZdGsSXhp7CRyw9k",
  authDomain: "kanker-konsul.firebaseapp.com",
  projectId: "kanker-konsul",
  storageBucket: "kanker-konsul.appspot.com",
  messagingSenderId: "904289219231",
  appId: "1:904289219231:web:de2f2917585871daab28aa",
  measurementId: "G-VK3MR6P0JD",
  databaseURL: "https://kanker-konsul-default-rtdb.firebaseio.com" // ✅ PENTING untuk Realtime DB
};

// Inisialisasi hanya sekali
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // optional, hanya jika di web production

// Export yang dibutuhkan
export { app };
export const db = getDatabase(app); // ✅ untuk Realtime Database
export const auth = getAuth(app); // kalau kamu pakai Auth
