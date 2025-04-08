// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    production: true,

  apiKey: "AIzaSyDuao_NRdFsNnz0tE7lnCo9F_XBt9rZ7q4",
  authDomain: "gardening-shop.firebaseapp.com",
  databaseURL: "https://gardening-shop-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gardening-shop",
  storageBucket: "gardening-shop.firebasestorage.app",
  messagingSenderId: "643976360922",
  appId: "1:643976360922:web:5b8f1131b7a0757193c6e3",
  measurementId: "G-52DVPWV5K5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);