import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Signup({ onClose, onSuccess }) {
    const [username, setUsername] = useState("");
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
            const res = await axios.post("http://127.0.0.1:8000/auth/signup", { username, email, password });
            const resp = res.data || {};
            // if backend returned token, use it. otherwise perform login.
            if (resp.access_token && resp.username) {
                login({ token: resp.access_token, username: resp.username });
            } else {
                // try to login
                const loginRes = await axios.post("http://127.0.0.1:8000/auth/login", { email, password });
                login({ token: loginRes.data.access_token, username: loginRes.data.username || username });
            }
            onSuccess && onSuccess(resp.username || username);
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
                <h3 className="text-white text-lg font-semibold mb-4">Create Account</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="px-3 py-2 rounded bg-white/5 text-white" required />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="px-3 py-2 rounded bg-white/5 text-white" required />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="px-3 py-2 rounded bg-white/5 text-white" required />
                    {error && <div className="text-red-400 text-sm">{error}</div>}
                    <div className="flex items-center justify-between">
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-indigo-500 text-white font-semibold hover:scale-105 transition">
                            {loading ? "Creating..." : "Sign up"}
                        </button>
                        <button type="button" onClick={onClose} className="px-3 py-2 rounded bg-white/6 text-white">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
