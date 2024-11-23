// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);