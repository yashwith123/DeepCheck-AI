import React from "react";

export default function ProfileCard({ username, email, joined }) {
    const initial = username ? username.charAt(0).toUpperCase() : "?";
    return (
        <div className="p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/60 rounded-xl shadow-xl transform transition hover:scale-[1.01]">
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl">
                    {initial}
                </div>
                <div>
                    <div className="text-xl font-semibold text-white">{username}</div>
                    <div className="text-sm text-slate-300">{email}</div>
                    <div className="text-xs text-slate-400 mt-1">Joined: {joined}</div>
                </div>
            </div>
        </div>
    );
}
