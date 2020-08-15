import Firebase from 'firebase'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUt5FGqhpPwZboGxhcm5jG-QzR-mAfm5c",
  authDomain: "vue4-93291.firebaseapp.com",
  databaseURL: "https://vue4-93291.firebaseio.com",
  projectId: "vue4-93291",
  storageBucket: "vue4-93291.appspot.com",
  messagingSenderId: "92673480718",
  appId: "1:92673480718:web:0afd52257dfd99b8a6045f"
};

// Initialize Firebase
Firebase.initializeApp(firebaseConfig);

export default Firebase;