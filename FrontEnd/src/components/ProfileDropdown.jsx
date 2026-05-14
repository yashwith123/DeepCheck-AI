import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfileDropdown() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        function onDoc(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("click", onDoc);
        return () => document.removeEventListener("click", onDoc);
    }, []);

    const initial = user ? user.charAt(0).toUpperCase() : "?";

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((s) => !s)}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-semibold">
                    {initial}
                </div>
                <div className="text-white/90 text-sm">{user}</div>
                <div className="text-slate-300">▾</div>
            </button>

            <div
                className={`absolute right-0 mt-2 w-44 bg-slate-800 rounded-lg shadow-lg ring-1 ring-white/5 transform transition-all origin-top-right ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                style={{ zIndex: 60 }}
            >
                <div className="flex flex-col py-2">
                    <button onClick={() => { window.location.href = '/profile' }} className="text-left px-4 py-2 hover:bg-white/5">Profile</button>
                    <button onClick={() => { window.location.href = '/settings' }} className="text-left px-4 py-2 hover:bg-white/5">Settings</button>
                    <button onClick={logout} className="text-left px-4 py-2 hover:bg-white/5">Logout</button>
                </div>
            </div>
        </div>
    );
}
