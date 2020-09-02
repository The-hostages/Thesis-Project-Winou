import Firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCY7YGcZmWZ6YbqyE2mF3apIjM7PyTfMTY",
  authDomain: "simulator-729a2.firebaseapp.com",
  databaseURL: "https://simulator-729a2.firebaseio.com",
  projectId: "simulator-729a2",
  storageBucket: "simulator-729a2.appspot.com",
  messagingSenderId: "133271947081",
  appId: "1:133271947081:web:99f249930971e1478e3c98",
};
const app = Firebase.initializeApp(firebaseConfig);
export const db = app.database();
