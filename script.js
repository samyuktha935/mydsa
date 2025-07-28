// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBvPSQLp1A_x0EAZ9DeqmPYsH7JnJM7uUQ",
  authDomain: "dsa-checklist.firebaseapp.com",
  projectId: "dsa-checklist",
  storageBucket: "dsa-checklist.appspot.com",
  messagingSenderId: "38220203496",
  appId: "1:38220203496:web:3e21aa98941473339c505d",
  measurementId: "G-NZ9L19D3GQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// UI elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Sign in
loginBtn.onclick = () => {
  signInWithPopup(auth, provider).catch(alert);
};

// Sign out
logoutBtn.onclick = () => {
  signOut(auth);
};

// Monitor auth state
onAuthStateChanged(auth, async user => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Load user data
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const saved = docSnap.data();
      checkboxes.forEach(cb => cb.checked = !!saved[cb.id]);
    }

    // Save on change
    checkboxes.forEach(cb => {
      cb.addEventListener('change', async () => {
        const newData = {};
        checkboxes.forEach(cb => newData[cb.id] = cb.checked);
        await setDoc(doc(db, "users", user.uid), newData);
      });
    });

  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});
