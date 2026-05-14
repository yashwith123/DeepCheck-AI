import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login({ onClose, onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axios.post("http://127.0.0.1:8000/auth/login", { email, password });
            const { access_token, username } = res.data;
            login({ token: access_token, username });
            onSuccess && onSuccess(username);
            onClose && onClose();
            setTimeout(() => (window.location.href = "/"), 300);
        } catch (err) {
            setError(err?.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="bg-slate-800 rounded-lg p-6 z-10 w-full max-w-md">
                <h3 className="text-white text-lg font-semibold mb-4">Sign In</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="px-3 py-2 rounded bg-white/5 text-white" required />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="px-3 py-2 rounded bg-white/5 text-white" required />
                    {error && <div className="text-red-400 text-sm">{error}</div>}
                    <div className="flex items-center justify-between">
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-cyan-400 text-slate-900 font-semibold hover:scale-105 transition">
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                        <button type="button" onClick={onClose} className="px-3 py-2 rounded bg-white/6 text-white">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
