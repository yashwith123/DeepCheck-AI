import React, { useEffect, useState } from "react";
import axios from "axios";
import HistoryCard from "../components/HistoryCard";
import Navbar from "../components/Navbar";

export default function History() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchHistory = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("dc_token");
            const res = await axios.get("http://127.0.0.1:8000/history", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setItems(res.data.items || []);
        } catch (err) {
            if (err.response && err.response.status === 401) setError("Unauthorized. Please sign in.");
            else setError(err.message || "Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this history item?")) return;
        try {
            const token = localStorage.getItem("dc_token");
            await axios.delete(`http://127.0.0.1:8000/history/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setItems((s) => s.filter((i) => i.id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const handleClear = async () => {
        if (!confirm("Clear all history? This cannot be undone.")) return;
        try {
            const token = localStorage.getItem("dc_token");
            await axios.delete(`http://127.0.0.1:8000/history`, { headers: { Authorization: `Bearer ${token}` } });
            setItems([]);
        } catch (err) {
            alert("Clear failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
            <Navbar />
            <main className="max-w-6xl mx-auto p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Analysis History</h2>
                    <div>
                        <button onClick={handleClear} className="px-3 py-2 bg-rose-600 rounded">Clear History</button>
                    </div>
                </div>

                <div className="mt-6">
                    {loading && <div>Loading history...</div>}
                    {error && <div className="text-rose-400">{error}</div>}
                    {!loading && !error && items.length === 0 && (
                        <div className="text-slate-400 p-8 bg-slate-800 rounded">No analysis history yet</div>
                    )}

                    <div className="mt-4 grid gap-4">
                        {items.map((it) => (
                            <HistoryCard key={it.id} item={it} onDelete={handleDelete} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
