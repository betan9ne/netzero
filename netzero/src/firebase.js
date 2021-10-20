import firebase from "firebase";
import "firebase/firestore";
import "firebase/storage"
import "firebase/auth"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXsOcJkULtPP4sonOFyKkOkDsznZJfphM",
  authDomain: "netzero-a417f.firebaseapp.com",
  projectId: "netzero-a417f",
  storageBucket: "netzero-a417f.appspot.com",
  messagingSenderId: "378417421321",
  appId: "1:378417421321:web:baf0c52f92d114936eacd8"
};

firebase.initializeApp(firebaseConfig);
export default firebase;