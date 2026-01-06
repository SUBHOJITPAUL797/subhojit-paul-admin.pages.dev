import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (user) return <Navigate to="/" />;

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#121212",
            color: "white",
            flexDirection: "column",
            gap: "20px"
        }}>
            <h1>Admin Portal</h1>
            <button
                onClick={handleLogin}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 24px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    background: "#fff",
                    color: "#333",
                    fontWeight: "bold"
                }}
            >
                <FcGoogle size={24} /> Sign in with Google
            </button>
            <p style={{ opacity: 0.5, fontSize: "14px" }}>Restricted Access Only</p>
        </div>
    );
};

export default Login;
