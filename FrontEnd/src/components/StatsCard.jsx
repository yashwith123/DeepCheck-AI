import React from "react";

export default function StatsCard({ title, value, accent }) {
    return (
        <div className="p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-xs text-slate-400">{title}</div>
            <div className={`text-2xl font-bold mt-2 ${accent || "text-white"}`}>{value}</div>
        </div>
    );
}
