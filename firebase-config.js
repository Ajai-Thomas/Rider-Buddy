// Firebase App (the core Firebase SDK) is always required and must be listed first
// You should already have these <script> tags in your HTML or "import" if using modules

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "rider-buddy-547cb.firebaseapp.com",
  projectId: "rider-buddy-547cb",
  storageBucket: "rider-buddy-547cb.appspot.com",
  messagingSenderId: "your-sender-id-here",
  appId: "your-app-id-here",
};

// Initialize Firebase only if not already done (important if using hot reload or modules)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

// Initialize Firebase services
const db = firebase.firestore();
const auth = firebase.auth();
const functions = firebase.app().functions('us-central1'); // You can change region if needed. Default is 'us-central1'

// Export for use in other modules/scripts (if using import/export system)
window.db = db;
window.auth = auth;
window.functions = functions;

// If NOT using modules, you can just use db, auth, functions globally after loading this file

// Example usage after this file is loaded:
//   db.collection('users').get()...
//   auth.signInWithEmailAndPassword(email, pass)...
//   functions.httpsCallable('functionName')(data)...

