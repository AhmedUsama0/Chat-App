import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDYqC3DgKhwwYGzuzMNq3E-am6W2WJL_1M",
  authDomain: "vue-firebase-chatapp-c9188.firebaseapp.com",
  projectId: "vue-firebase-chatapp-c9188",
  storageBucket: "vue-firebase-chatapp-c9188.appspot.com",
  messagingSenderId: "425220076593",
  appId: "1:425220076593:web:d1fd1cc113a0176a849110",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage();
export const usersColl = collection(db, "users");
export const messagesColl = collection(db, "messages");
