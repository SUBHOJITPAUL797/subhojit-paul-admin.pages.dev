import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

interface SiteContent {
    header: {
        title: string;
        subtitle1: string;
        subtitle2: string;
        subtitle3: string;
        subtitle4: string;
    };
    about: {
        title: string;
        description: string;
        imageUrl: string;
    };
    whatIDo: {
        title: string;
        cards: { title: string; description: string; icon: string }[];
    }[];
    skills: {
        title: string;
        techStack: string[]; // URLs of images
    };
}

const DEFAULT_CONTENT: SiteContent = {
    header: {
        title: "SUBHOJIT PAUL",
        subtitle1: "Designer",
        subtitle2: "Developer",
        subtitle3: "Developer",
        subtitle4: "Designer"
    },
    about: {
        title: "About Me",
        description: "I am a creative developer...",
        imageUrl: "/images/resume-image.png"
    },
    whatIDo: [], // Array of service cards
    skills: {
        title: "My Techstack",
        techStack: [
            "/images/react2.webp",
            "/images/next2.webp",
            "/images/node2.webp",
            // ... others
        ]
    }
};

const ContentManager = () => {
    const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"header" | "about" | "whatido" | "skills">("header");

    const fetchContent = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "siteContent", "main");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setContent({ ...DEFAULT_CONTENT, ...docSnap.data() } as SiteContent);
            }
        } catch (e) {
            console.error("Error fetching content", e);
        }
        setLoading(false);
    };

    useEffect(() => { fetchContent(); }, []);

    const handleSave = async () => {
        try {
            await setDoc(doc(db, "siteContent", "main"), content);
            alert("Content saved successfully!");
        } catch (e) {
            alert("Error saving content.");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ color: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h1>Site Content Manager</h1>
                <button onClick={handleSave} style={{ padding: "10px 20px", background: "#4CAF50", border: "none", color: "white", borderRadius: "5px", cursor: "pointer" }}>SAVE ALL CHANGES</button>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                {["header", "about", "whatido", "skills"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        style={{
                            padding: "10px 20px",
                            background: activeTab === tab ? "var(--accentColor, #646cff)" : "#333",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            textTransform: "capitalize"
                        }}
                    >
                        {tab.replace("whatido", "What I Do")}
                    </button>
                ))}
            </div>

            <div style={{ background: "#222", padding: "20px", borderRadius: "8px" }}>
                {activeTab === "header" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <h3>Header Section</h3>
                        <label>Main Title (Name)</label>
                        <input
                            value={content.header.title}
                            onChange={e => setContent({ ...content, header: { ...content.header, title: e.target.value } })}
                            style={inputStyle}
                        />
                        <label>Subtitle 1 (e.g. Designer)</label>
                        <input
                            value={content.header.subtitle1}
                            onChange={e => setContent({ ...content, header: { ...content.header, subtitle1: e.target.value } })}
                            style={inputStyle}
                        />
                        <label>Subtitle 2 (e.g. Developer)</label>
                        <input
                            value={content.header.subtitle2}
                            onChange={e => setContent({ ...content, header: { ...content.header, subtitle2: e.target.value } })}
                            style={inputStyle}
                        />
                        <label>Subtitle 3 (Animated)</label>
                        <input
                            value={content.header.subtitle3}
                            onChange={e => setContent({ ...content, header: { ...content.header, subtitle3: e.target.value } })}
                            style={inputStyle}
                        />
                        <label>Subtitle 4 (Animated)</label>
                        <input
                            value={content.header.subtitle4}
                            onChange={e => setContent({ ...content, header: { ...content.header, subtitle4: e.target.value } })}
                            style={inputStyle}
                        />
                    </div>
                )}

                {activeTab === "about" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <h3>About Section</h3>
                        <label>Title</label>
                        <input
                            value={content.about.title}
                            onChange={e => setContent({ ...content, about: { ...content.about, title: e.target.value } })}
                            style={inputStyle}
                        />
                        <label>Description</label>
                        <textarea
                            value={content.about.description}
                            onChange={e => setContent({ ...content, about: { ...content.about, description: e.target.value } })}
                            style={{ ...inputStyle, minHeight: "100px" }}
                        />
                        <label>Image URL</label>
                        <input
                            value={content.about.imageUrl}
                            onChange={e => setContent({ ...content, about: { ...content.about, imageUrl: e.target.value } })}
                            style={inputStyle}
                        />
                    </div>
                )}

                {/* Similar logic for What I Do and Skills - Simplified for brevity in this turn */}
                {activeTab === "whatido" && (
                    <div>
                        <h3>What I Do (Edit JSON for complex nested lists)</h3>
                        <textarea
                            value={JSON.stringify(content.whatIDo, null, 2)}
                            onChange={e => {
                                try {
                                    const parsed = JSON.parse(e.target.value);
                                    setContent({ ...content, whatIDo: parsed });
                                } catch (err) { /* ignore invalid json while typing */ }
                            }}
                            style={{ ...inputStyle, height: "300px", fontFamily: "monospace" }}
                        />
                    </div>
                )}

                {activeTab === "skills" && (
                    <div>
                        <h3>Skills Tech Stack (Image URLs)</h3>
                        <label>Title</label>
                        <input
                            value={content.skills.title}
                            onChange={e => setContent({ ...content, skills: { ...content.skills, title: e.target.value } })}
                            style={inputStyle}
                        />
                        <label>Images List (JSON Array)</label>
                        <textarea
                            value={JSON.stringify(content.skills.techStack, null, 2)}
                            onChange={e => {
                                try {
                                    const parsed = JSON.parse(e.target.value);
                                    setContent({ ...content, skills: { ...content.skills, techStack: parsed } });
                                } catch (err) { /* ignore */ }
                            }}
                            style={{ ...inputStyle, height: "300px", fontFamily: "monospace" }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const inputStyle = {
    padding: "10px",
    background: "#333",
    border: "none",
    color: "white",
    width: "100%",
    borderRadius: "5px"
};

export default ContentManager;
