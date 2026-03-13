import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyARme9xrcY3hTilVDrFF9Mw0nijO7UU7ro",
  authDomain: "oprec-613ec.firebaseapp.com",
  databaseURL: "https://oprec-613ec-default-rtdb.firebaseio.com",
  projectId: "oprec-613ec",
  storageBucket: "oprec-613ec.firebasestorage.app",
  messagingSenderId: "539472474855",
  appId: "1:539472474855:web:ceb133adcd9a25341ee842",
  measurementId: "G-MQD7TL9X5S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
