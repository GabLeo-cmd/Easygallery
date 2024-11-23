// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAX6-29BDRrA27whX40vdFn1Bg8WL4aK8Q",
  authDomain: "bicos21-d11f6.firebaseapp.com",
  databaseURL: "https://bicos21-d11f6-default-rtdb.firebaseio.com",
  projectId: "bicos21-d11f6",
  storageBucket: "bicos21-d11f6.appspot.com",
  messagingSenderId: "877360516073",
  appId: "1:877360516073:web:495d108ae6846b7f369978",
  measurementId: "G-S9J6YMDWYP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);
const auth = getAuth(app);

export { app, storage, database, auth };