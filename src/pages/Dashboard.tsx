import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/login");
    };

    return (
        <div style={{ display: "flex", height: "100vh", background: "#1a1a1a", color: "white" }}>
            <aside style={{ width: "250px", background: "#111", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <h2>Admin Panel</h2>
                <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Link to="/projects" style={{ color: "white", textDecoration: "none", padding: "10px", background: "#222", borderRadius: "8px" }}>Projects</Link>
                    <Link to="/resume" style={{ color: "white", textDecoration: "none", padding: "10px", background: "#222", borderRadius: "8px" }}>Resume Data</Link>
                </nav>
                <div style={{ marginTop: "auto" }}>
                    <p style={{ fontSize: "12px", opacity: 0.5 }}>Logged in as:<br />{user?.email}</p>
                    <button onClick={handleLogout} style={{ width: "100%", padding: "10px", marginTop: "10px", background: "#d32f2f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Logout</button>
                </div>
            </aside>
            <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Dashboard;
