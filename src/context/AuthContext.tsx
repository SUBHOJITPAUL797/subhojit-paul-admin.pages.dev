import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, signOut: async () => { } });

export const useAuth = () => useContext(AuthContext);

const ALLOWED_EMAILS = [
    "subhojitpaul26042004@gmail.com",
    "suvojitpal797@gmail.com"
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                if (currentUser.email && ALLOWED_EMAILS.includes(currentUser.email)) {
                    setUser(currentUser);
                } else {
                    console.warn("Unauthorized email access attempt:", currentUser.email);
                    await firebaseSignOut(auth);
                    setUser(null);
                    // Ideally show a toast here, but we'll stick to logic first
                    alert("Access Denied: You are not authorized to view this panel.");
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signOut = () => firebaseSignOut(auth);

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
