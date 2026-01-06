import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const ResumeManager = () => {
    const [data, setData] = useState<string>("");
    const [loading, setLoading] = useState(true);

    // We will store the ENTIRE resume JSON as a string for easy editing
    // In a real app we might want structured forms, but for "full control" JSON is flexible

    const fetchResume = async () => {
        setLoading(true);
        const docRef = doc(db, "resume", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setData(JSON.stringify(docSnap.data(), null, 2));
        } else {
            // Default template
            setData(JSON.stringify({
                header: { name: "Your Name", email: "" },
                education: [],
                projects: [],
                skills: []
            }, null, 2));
        }
        setLoading(false);
    };

    useEffect(() => { fetchResume(); }, []);

    const handleSave = async () => {
        try {
            const parsed = JSON.parse(data);
            await setDoc(doc(db, "resume", "main"), parsed);
            alert("Resume data saved successfully!");
        } catch (e) {
            alert("Invalid JSON! Please check your syntax.");
        }
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h1>Manage Resume Data</h1>
                <button onClick={handleSave} style={{ padding: "10px 20px", background: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>SAVE CHANGES</button>
            </div>
            <p style={{ opacity: 0.7, marginBottom: "10px" }}>Edit the JSON below directly to update your resume content.</p>

            {loading ? <p>Loading...</p> : (
                <textarea
                    value={data}
                    onChange={e => setData(e.target.value)}
                    style={{
                        flex: 1,
                        width: "100%",
                        background: "#111",
                        color: "#0f0",
                        fontFamily: "monospace",
                        padding: "20px",
                        border: "1px solid #333",
                        borderRadius: "5px",
                        resize: "none"
                    }}
                />
            )}
        </div>
    );
};

export default ResumeManager;
