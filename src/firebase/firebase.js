import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYqC3DgKhwwYGzuzMNq3E-am6W2WJL_1M",
  authDomain: "vue-firebase-chatapp-c9188.firebaseapp.com",
  projectId: "vue-firebase-chatapp-c9188",
  storageBucket: "vue-firebase-chatapp-c9188.appspot.com",
  messagingSenderId: "425220076593",
  appId: "1:425220076593:web:d1fd1cc113a0176a849110",
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const usersColl = collection(db, "users");
export const messagesColl = collection(db, "messages");
export const storage = getStorage();
