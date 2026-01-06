import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData } from "firebase/firestore";
import { db } from "../firebase";

interface Project {
    id?: string;
    title: string;
    description: string;
    links: { label: string; href: string }[];
}

const ProjectManager = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Project | null>(null);

    // Form State
    const [form, setForm] = useState<Project>({ title: "", description: "", links: [{ label: "Open", href: "" }] });

    const fetchProjects = async () => {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "projects"));
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects(list);
        setLoading(false);
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editing && editing.id) {
                await updateDoc(doc(db, "projects", editing.id), { ...form });
            } else {
                await addDoc(collection(db, "projects"), form);
            }
            setForm({ title: "", description: "", links: [{ label: "Open", href: "" }] });
            setEditing(null);
            fetchProjects();
        } catch (err) {
            console.error(err);
            alert("Error saving project");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure?")) {
            await deleteDoc(doc(db, "projects", id));
            fetchProjects();
        }
    };

    const startEdit = (p: Project) => {
        setEditing(p);
        setForm(p);
    };

    return (
        <div>
            <h1>Manage Projects</h1>

            {/* Editor Form */}
            <div style={{ background: "#222", padding: "20px", borderRadius: "10px", marginBottom: "40px" }}>
                <h3>{editing ? "Edit Project" : "Add New Project"}</h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "500px" }}>
                    <input
                        placeholder="Title"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        required
                        style={{ padding: "10px", background: "#333", border: "none", color: "white" }}
                    />
                    <textarea
                        placeholder="Description"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        required
                        style={{ padding: "10px", background: "#333", border: "none", color: "white", minHeight: "80px" }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input
                            placeholder="Link Label (e.g. Open)"
                            value={form.links[0].label}
                            onChange={e => setForm({ ...form, links: [{ ...form.links[0], label: e.target.value }] })}
                            style={{ padding: "10px", background: "#333", border: "none", color: "white", flex: 1 }}
                        />
                        <input
                            placeholder="URL"
                            value={form.links[0].href}
                            onChange={e => setForm({ ...form, links: [{ ...form.links[0], href: e.target.value }] })}
                            required
                            style={{ padding: "10px", background: "#333", border: "none", color: "white", flex: 2 }}
                        />
                    </div>
                    <button type="submit" style={{ padding: "10px", background: "var(--accentColor, #646cff)", color: "white", border: "none", cursor: "pointer" }}>
                        {editing ? "Update Project" : "Add Project"}
                    </button>
                    {editing && <button type="button" onClick={() => { setEditing(null); setForm({ title: "", description: "", links: [{ label: "Open", href: "" }] }) }}>Cancel</button>}
                </form>
            </div>

            {/* List */}
            <div style={{ display: "grid", gap: "20px" }}>
                {loading ? <p>Loading...</p> : projects.map(p => (
                    <div key={p.id} style={{ background: "#1e1e1e", padding: "20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <h3 style={{ margin: 0 }}>{p.title}</h3>
                            <p style={{ margin: "5px 0", color: "#aaa" }}>{p.description}</p>
                            <a href={p.links[0]?.href} target="_blank" style={{ color: "#646cff" }}>{p.links[0]?.href}</a>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => startEdit(p)} style={{ padding: "5px 10px", cursor: "pointer" }}>Edit</button>
                            <button onClick={() => handleDelete(p.id!)} style={{ padding: "5px 10px", background: "red", color: "white", border: "none", cursor: "pointer" }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectManager;
