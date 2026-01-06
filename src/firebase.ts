import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCq6xzYYsHh8FpwKVfVWoRfdpNoi3A81l8",
    authDomain: "subhojit-paul-portfolio.firebaseapp.com",
    projectId: "subhojit-paul-portfolio",
    storageBucket: "subhojit-paul-portfolio.firebasestorage.app",
    messagingSenderId: "849622748228",
    appId: "1:849622748228:web:d89395b3cf7c65304dc011",
    measurementId: "G-R0K3XTC0RL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
